import { App, AppPermission } from '@rocket.chat/core-typings';

import { Apps } from '../../../../../app/apps/client/orchestrator';
import { handleAPIError, warnStatusChange } from '../helpers';

type installAppProps = App & {
	permissionsGranted: AppPermission[];
};

export const installApp = async ({ id, name, marketplaceVersion, permissionsGranted }: installAppProps): Promise<void> => {
	try {
		const { status } = await Apps.installApp(id, marketplaceVersion, permissionsGranted);
		if (status) {
			warnStatusChange(name, status);
		}
	} catch (error) {
		handleAPIError(error);
	}
};
