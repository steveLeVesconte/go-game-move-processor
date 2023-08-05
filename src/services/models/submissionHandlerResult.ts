import { BaseSubmissionResult } from "./submissionResult";

export default class SubmissionHandlerResult {
    constructor(public submissionHandled: boolean = false, public submissionResult: BaseSubmissionResult) {}
}