// console.log(fetch("list_of_alleles.json"))


// import configData from 


function get_list_of_alleles(file) {
	import jsonAlleles from 'list_of_alleles.json';
	let parsedJson = JSON.parse(jsonAlleles);
	console.log(parsedJson);
	return "c'est un test";
}