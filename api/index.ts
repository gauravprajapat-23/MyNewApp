// API Services Index
export { apiRequest, getErrorMessage } from './client';
export type { ApiResponse } from './client';

export { fetchAgents, searchAgentsApi, fetchNearbyAgents, fetchAgentById, updateAgentStatus } from './agents';
export { loginOrCreateUser, fetchUserById, updateUser } from './users';
export type { User } from './users';
export { fetchUserFavorites, addFavorite, removeFavorite, checkFavoriteStatus } from './favorites';
export { createTransaction, fetchTransactions, fetchUserTransactions, fetchAgentTransactions, updateTransactionStatus, fetchTransactionById } from './transactions';
export type { Transaction, TransactionData } from './transactions';
export { mapAgentToDepositPoint, mapAgentsList } from './mappers';
