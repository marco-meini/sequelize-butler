export interface Result {
  success: boolean;
  message: string;
  subresults?: Array<Result>;
}
