export function handleResponse(response) {
	var res = {
		elastic: response.elastic,
		visualization: response.visualization
	};
	return res;
}