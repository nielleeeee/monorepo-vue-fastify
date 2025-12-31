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

export interface EmailParams {
    email: string;
    name: string;
    subject?: string;
    emailMessage?: string;
}

export interface SMSParams {
    phone: string;
    name: string;
    smsMessage?: string;
}

export interface SampleWorkflowParams extends EmailParams, SMSParams {}

export interface QueueParams {
    id: string;
    data: QueueData;
}
export interface QueueData {
    name: string;
    email: string;
    phone: string;
}

export interface AppContext<TEnv = CloudflareBindings> {
    env: TEnv;
    headers: Headers;
}

