var names = ["Andrew","Chatty","David","John","Jon"];
//var names = ['Andrew','Chatty','David','John','Jon','Mark','Martin','Patrick','Sue','Thomas','Will'];

function insertTable()
{
    var startHr = document.getElementById('startHour').value;
    var numPeople = document.getElementById('numP').value;
    var theader = "<table id='table1'>";
    var tbody = "";
    var hour = Number(startHr)-1;
    var min =0;
    var graph = buildGraph(numPeople);
    var finalResult = major(graph);
	console.log(JSON.stringify(names));
	console.log(Number(numPeople));
    if (names.length === Number(numPeople)){
    	//Output names for table heading
        theader += "<th> " +" </th>";
        for(var j = 0; j < numPeople; j++)
        {
          theader += "<th> "+ names[j] +" </th>";
        }

        for(var i = 0; i < numPeople; i++)
        {
            //first column: setting time
            if (i%2 == 0) {
                min = '00';
                hour++;
            } else {
                min = '30';
            }
            tbody += "<tr>";
            tbody += "<td>";
            tbody += hour + ': ' + min;
            tbody += "</td>"

            //filling cells with data
            for(var j = 1; j <= numPeople; j++)
            {
                tbody += "<td>";
                var round = finalResult[i];
                for (var g = 0; g < round.length; g++){
                	var meeting = round[g];
                	if (names[j-1] == meeting[0].key){
                		tbody += meeting[0].value;
                	} else if (names[j-1] == meeting[1].key) {
                		tbody += meeting[1].value;
                	}
            	}
                tbody += "</td>"
            }
            tbody += "</tr>";
        }
        var tfooter = "</table>";
        document.getElementById('wrapper').innerHTML = theader + tbody + tfooter;

    } else {
        alert('Entry number of people does not match number of engineers\' names in data. Please update array \'names\' first');
    }
}

function buildGraph (numPeople){
    var vertices =[];
    for (var a = 0; a < numPeople; a++){
        var vertex = buildVertex(names[a],a,numPeople);
        vertices.push(vertex);
    }
    return vertices;
}

function buildVertex (name, index, numPeople){
    var result = {};
    result.id = index;
    result.name = name;
	result.visited = false;
    var neighbors = [];
    for (var b = 0; b < numPeople; b++){
        if (b == index) {
        } else {
            neighbors.push(names[b]);
        }
    }
    result.neighbors = neighbors;
    return result;
}

//returns true if there's edge left in graph
function edgesLeft(graph){
    for (var c = 0; c < graph.length; c++){
        if (graph[c].neighbors.length > 0){
            return true;
        }
    }
    return false;
}

function vertexByName (graph, name){

	for (var k = 0; k < graph.length; k++){
		if (name == graph[k].name){
			return graph[k];
		}
	}
}

function longestNeibors (vertex, graph){
	var edges = vertex.neighbors;
	var max = 0;
	var maxIndex = -1;
	var pos = -1;
	for (var h = 0; h < edges.length; h++){
		var v = vertexByName(graph, edges[h]);
		if (Number(v.neighbors.length) > max && !v.visited) {
			max = Number(v.neighbors.length);
			maxIndex = h;
		}
	}
	if (maxIndex != -1) {
		pos = graph.map(function(n) {return n.name;}).indexOf(edges[maxIndex]);
	}
	return pos;
}

function major (graph) {
    var finalResult = [];
    //while (edgesLeft(graph)){
    for (var i = 0; i < 5; i++){
        console.log('--------------------'+i+'-------------------------');
    	var rounds = []; 

    	// var waiting = names; 
        for (var d = 0; d < graph.length; d++){
            var result = [];
            var firstV = graph[d];
            //here
            //var secondV = graph[2*d + 1];
			if (firstV.neighbors.length == 0 || firstV.visited) {
                continue;
            }
			
			var secondIndex = longestNeibors(firstV,graph);
			if (secondIndex == -1) continue;
            var secondV = graph[secondIndex];
            console.log(secondV);
			
            // waiting.splice(names.indexOf(firstV.name));
            // waiting.splice(names.indexOf(secondV.name));            
            var o1 = {key: firstV.name, value: secondV.name};
            var o2 = {key: secondV.name, value: firstV.name};
            result.push(o1);
            result.push(o2);
            rounds.push(result); 

            var firstRemoveIndex = firstV.neighbors.indexOf(secondV.name);
            if(firstRemoveIndex > -1) {
                firstV.neighbors.splice(firstRemoveIndex, 1);
                console.log("First Length:" + firstV.neighbors.length);
				firstV.visited = true;
            } else {
            }
 
            var secondRemoveIndex = secondV.neighbors.indexOf(firstV.name); 

            if(secondRemoveIndex > -1 ) {       
                secondV.neighbors.splice(secondRemoveIndex, 1);
                console.log("Second Length:" + secondV.neighbors.length);
				secondV.visited = true;
            } else {
            }
        }
        finalResult.push(rounds); 
        graph.sort(function(a,b){
            return b.neighbors.length - a.neighbors.length ; 
        });
		
		for (var k = 0; k < graph.length; k++) {
            console.log("revisit " + graph[k].neighbors.length);
            graph[k].visited = false;
        }
    }
    //}
    console.log(graph); 
    console.log(finalResult);
    // finalResult =[ [[{key:'Andrew',value:'Chatty'},{key:'Chatty' ,value:'Andrew'}],
    // 				[{key: 'David',value:'John' }, {key:'John' ,value:'David' }]
    // 			   ],
    // 				[[{key: 'Jon',value:'Andrew'}, {key:'Andrew' ,value:'Jon' }],
    // 				[{key: 'Chatty',value:'David' }, {key:'David' ,value:'Chatty' }]
    // 				],
    // 				[[{key: 'John',value:'Jon'}, {key:'Jon' ,value:'John' }],
    // 				[{key: 'Andrew',value:'David' }, {key:'David' ,value:'Andrew' }]
    // 				],
    // 				[[{key: 'Chatty',value:'John'}, {key:'John' ,value:'Chatty' }],
    // 				[{key: 'David',value:'Jon' }, {key:'Jon' ,value:'David' }]
    // 				],
    // 				[[{key: 'Andrew',value:'John'}, {key:'John' ,value:'Andrew' }],
    // 				[{key: 'Chatty',value:'Jon' }, {key:'Jon' ,value:'Chatty' }]]
    // 			];
    return finalResult; 
}

