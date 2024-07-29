const core = require('@actions/core');
const fs = require('fs');
// const { createApi } = require('../../external-events/src/utils/create-api');

// async function loadSecrets(serviceAccountKey) {
//     const getSecret = (name) => loadSecret(serviceAccountKey, name);

//     return {
//         key: await getSecret('iam-api-key-prod'),
//         email: await getSecret('ccc-sync-admin'),
//         pass: await getSecret('ccc-sync-pass'),
//         gipTenantId: await getSecret('exe-api-tenant-id'),
//     };
// }

const run = async (act) => {
  try {
    await act();
  } catch (err) {
    core.setFailed(err.message);
  }
};

function printReport(report) {
  for (const {
    kind, messages, warnings, errors,
  } of report.reports) {
    core.startGroup(`${kind}`);

    if (messages) {
      for (const message of messages) {
        console.log(`[Message]: ${message}`);
      }
    }
    if (warnings) {
      for (const warning of warnings) {
        console.warn(`[Warning]: ${warning}`);
      }
    }
    if (errors) {
      for (const error of errors) {
        console.error(`[Error]: ${error}`);
      }
    }

    core.endGroup();
  }
}

async function action() {
  const dryRun = core.getBooleanInput('dry-run') === true;
  const inputFiles = core.getInput('schema-files').split(';');
  // const secrets = await loadSecrets(serviceAccountKey);
  // const cccApi = createApi({ name: 'customer-config', auth: secrets, url: 'https://ccc-api.retailsvc.com' });

  const payload = inputFiles.map(file => {
    return {
      kind: file.substring(file.lastIndexOf('/') + 1, file.lastIndexOf('.')),
      schemaFile: file,
      schemaValue: JSON.parse(fs.readFileSync(file, 'utf8')),
    }
  });

  //TODO: get results for all schema files
  // // eslint-disable-next-line no-await-in-loop
  // const { data } = await cccApi.post(
  //   `/api/v1/internal/schema:sync?dryRun=${dryRun}`,
  //   camelcaseKeys(def, { deep: true }),
  // );

  const notExistingKind = 'che.not-existing.v1';
  const notExistingKindFileName = `${notExistingKind}.json`;
  const kind = 'che.workspace.v1';
  const kindFileName = `${kind}.json`;
  const kind2 = 'che.workspace.v2';
  const kind2FileName = `${kind2}.json`;
  const report = {
    reports: [
      {
        kind: notExistingKind,
        messages: ['Skipped'],
        warnings: [
          `Schema ${notExistingKindFileName} is not attached to any kind, skipping backwards compatibility check`,
        ],
      },
      {
        kind: kind,
        messages: [
          `Schema ${kindFileName} for kind ${kind} is backwards compatible`,
        ],
      },
      {
        kind: kind2,
        messages: [
          `Schema ${kind2FileName} for kind ${kind2} is not backwards compatible`,
        ],
        errors: [
          '{"error":"Undefined must have required property \\"newProp\\"","path":""}',
        ],
      },
    ],
    success: false,
  };

  printReport(report);

  if (!report.success) {
    core.setFailed('Sync process had some errors (see details above).');
  }

  core.info('Sync process completed successfully.');



  // const failed = false;
  // for (const schemaFile of results) {
  //   core.startGroup(`Sync schema from ${schemaFile}`);
  //   // // eslint-disable-next-line no-await-in-loop
  //   // const { data } = await cccApi.post(
  //   //   `/api/v1/internal/schema:sync?dryRun=${dryRun}`,
  //   //   camelcaseKeys(def, { deep: true }),
  //   // );

  //   // printSyncResult(data.report);

  //   // if (!data.success) {
  //   //   failed = true;
  //   //   core.error('Sync process had some errors (see details above).');
  //   // }
  //   core.endGroup();
  // }
  // if (failed) {
  //   throw new Error('Sync process had some errors (see details above).');
  // }
}

if (require.main === module) {
  run(action);
}

module.exports = action;
