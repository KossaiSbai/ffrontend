export interface Submission {
    id: number;
    influencer_id: number;
    brief_id: number;
    text: string;
    created_at: string;
    status: string;
    brand_id: number;
    feedback: string;
}

export interface Influencer {
    id: number;
    name: string;
}

export interface Brief {
    id: number;
    name: string;
}