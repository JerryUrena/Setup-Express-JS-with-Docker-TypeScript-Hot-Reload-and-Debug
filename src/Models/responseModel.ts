/**
 * This model is the response model that will be returned in any response request.
 */
export interface IResponseModel
{
    success: boolean,
    message: any,
    data?: any,
    status: number
}