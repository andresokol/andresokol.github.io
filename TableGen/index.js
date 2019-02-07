// document.getElementById('code_template').value = `<h1>{0}</h1>`;

function apply_template() {
	var a = document.getElementById('code_template');
	var b = document.getElementById('data_input');
	var template = a.value;
	var data_lines = b.value.split('\n');
	var big_result = data_lines.reduce((acc, line) => {
		var values = line.split(/[,\t]/g); 
		// console.log(values);
		
		var result = values.reduce((acc, val, i) => {
			var pattern = `{${i}}`;
			return acc.replace(pattern, val);
		}, template);

		// console.log(result);

		return [...acc, result];
	}, []);

	var target = document.getElementById('target');
	console.log(big_result);

	var result = '';

	big_result.map((table) => 
		result += `<div class="cnt">
	<div>${table}</div>
	<div>
		<code>${table.replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/\n/g, '<br/>')}</code>
	</div>
</div>`);

	result += '<code>' + big_result.join('\n\n').replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/\n/g, '<br/>') + '</code>';

	target.innerHTML = result;
}
