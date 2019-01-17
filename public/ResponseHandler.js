export function handleResponse(response) {
	console.log(response)
	var res = {
		elastic: response.elastic,
		visualization: response.visualization
	};
	return res;
}