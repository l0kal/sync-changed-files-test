const core = require('@actions/core');
const fs = require('fs/promises');
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

function printSyncResult(report) {
    for (const {
        id, success, performedAction, error,
    } of report) {
        if (success) {
            // eslint-disable-next-line no-unused-expressions
            core.info(`[${id}]: ${performedAction}`);
        } else {
            core.error(`[${id}]: ${error}`);
        }
    }
}

async function action() {
    const serviceAccountKey = core.getInput('service-account-key', { required: true });
    const dryRun = core.getBooleanInput('dry-run') === true;

    const inputFiles = core.getInput('schema-files').split(';');
    // const secrets = await loadSecrets(serviceAccountKey);
    // const cccApi = createApi({ name: 'customer-config', auth: secrets, url: 'https://ccc-api.retailsvc.com' });

    const payload = schemaFiles.map(async (file) => ({ kind: file.split('.json')[0], filename: file, schemaValue: JSON.parse(await fs.readFile(file, 'utf8')) }));
    core.info('requestPayload:', payload);

    const failed = false;
    // for (const schemaFile of schemaFiles) {
    //     core.startGroup(`Sync schema from ${schemaFile}`);
    //     // eslint-disable-next-line no-await-in-loop
    //     const { data } = await cccApi.post(
    //         `/api/v1/internal/schema:sync?dryRun=${dryRun}`,
    //         camelcaseKeys(def, { deep: true }),
    //     );

    //     printSyncResult(data.report);

    //     if (!data.success) {
    //         failed = true;
    //         core.error('Sync process had some errors (see details above).');
    //     }
    //     core.endGroup();
    // }
    if (failed) {
        throw new Error('Sync process had some errors (see details above).');
    }
}

if (require.main === module) {
    run(action);
}

module.exports = action;
