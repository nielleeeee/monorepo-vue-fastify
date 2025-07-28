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
