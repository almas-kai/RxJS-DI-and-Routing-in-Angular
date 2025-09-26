export type LoadingState<T> = {
	isLoading: boolean,
	error: Error | null,
	data: T | null
}