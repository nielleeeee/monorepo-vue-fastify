export interface Params {
    name: string;
}

export interface WorkflowResponse {
    success: boolean;
    message: string;
    id?: string;
}

export interface WorkflowStatus extends WorkflowResponse {
    data: {
        status: string;
        output?: any;
    };
}