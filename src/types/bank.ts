export interface QuestionBank {
  id: string;
  name: string;
  description?: string;
  owner: {
    id: string;
    name: string;
    email: string;
  };
  topics: string[];
  isPublic: boolean;
  permission?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionBankShare {
  userId: string;
  userName: string;
  userEmail: string;
  permission: string;
  sharedAt: string;
}
