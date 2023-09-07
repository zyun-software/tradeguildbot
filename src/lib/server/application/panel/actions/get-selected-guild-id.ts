import { ApiAction, getDefaultApiActionResult, type ApiActionExecuteType } from '../../api';

export class GetSelectedGuildIdAction extends ApiAction<{}, number | null> {
	public async execute(): Promise<ApiActionExecuteType<number | null>> {
		const result = getDefaultApiActionResult<number | null>();

		result.success = true;
		result.response = this._user.data.selectedGuildId ?? null;

		return result;
	}
}
