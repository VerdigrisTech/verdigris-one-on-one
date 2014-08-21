var names = ['Andrew', 'Chatty', 'David', 'Dawn', 'Jacques',
              'Jan', 'John', 'Jon', 'Luke', 'Mark',
              'Martin', 'Sue', 'Thomas', 'Will'];
var time = ["10:20", "10:40", "11:00", "11:20","11:40",
            "12:00","12:20", "12:40","13:00","13:20", "13:40",
            "14:00","14:20", "14:40","15:00","15:20", "15:40"];
//tables2 = divideTablesWeek2(graph3, graph4);
var tables2 = [['Andrew', 'David', 'Luke', 'Martin'],
               ['Chatty',' Dawn', 'John', 'Sue'],
               ['Jacques', 'Mark', 'Thomas'],
               ['Jan', 'Jon', 'Will']];
var numPeoplePerTable = 4;

function getStartDayOfWeek(weekNo){
    var d1 = new Date();
    numOfdaysPastSinceLastMonday = eval(d1.getDay()- 1);
    d1.setDate(d1.getDate() - numOfdaysPastSinceLastMonday);
    return d1;
};

function printHeadingRow (theader, numPeople, names) {
    //Output names for table heading, ie, people's names
    theader += "<th> " +" </th>";
    for(var j = 0; j < numPeople; j++)
    {
      theader += "<th> "+ names[j] +" </th>";
    }
    return theader;
}

function minSlots (interval) {
    var len = 60/interval;
    var result = [];
    result[0] = '00';
    for (var i = 1; i <= len; i++) {
        result[i] = 60/len*i
    }
    if (interval == 30) {
        shiftArray(result);
    }

    return result;
}

function shiftArray (slotArray) {
    var result = [];
    for (var i = 0; i < slotArray.length -1; i++){
        result[i] = result[i+1];
    }
    result[length -1] = slotArray[0];
    return result;
}

function insertTable()
{
    //add/remove people
    var addPerson = document.getElementById('addP').value;
    if(addPerson) {names.push(addPerson);}
    var removePerson = document.getElementById('removeP').value;
    removePeople(removePerson);

    var numPeople = names.length;
    var numWeeks = document.getElementById('weekNum').value;
    //var weekThrehold = ((numPeople+1)/numWeeks);
    var weekThrehold = 4;

    var startHr = document.getElementById('startHour').value;

    var weekNum = 1;
    var currentWeekNum = (new Date()).getWeek();
    var startDate = getStartDayOfWeek(currentWeekNum);
    var theader = "<table id='table1'>";
    var tbody = "";
    var tables = divideTables();
    var part1 = new Array();
    var part2 = new Array();

    // put all the tables into two sets for pairing
    partition(tables, part1, part2);

    // build graphs for the two sets
    var graph1 = buildGraph(part1);
    var graph2 = buildGraph(part2);

    // remove pairs between people in the same table
    removeSameTablePairs(tables, graph1, graph2);

    // make schedules for two sets
    var finalResult1 = major(graph1, 4);
    var finalResult2 = major(graph2, 4);

    // put the schedules together for display
    for (var r = 0; r < Math.max(finalResult1.length, finalResult2.length); r++) {
        finalResult1[r].push.apply(finalResult1[r], finalResult2[r]);
    }

    // rearrange table for week 2
    var originalTables = tables.slice(0);
    rearrangeTables(tables);
    var part3 = new Array();
    var part4 = new Array();
    partition(tables, part3, part4);
    var graph3 = buildGraph(part3);
    var graph4 = buildGraph(part4);
    removeSameTablePairs(tables, graph3, graph4);
    var finalResult3 = major(graph3, 4);
    var finalResult4 = major(graph4, 4);
    for (var r = 0; r < Math.max(finalResult3.length, finalResult4.length); r++) {
        finalResult3[r].push.apply(finalResult3[r], finalResult4[r]);
    }

    finalResult1.push.apply(finalResult1, finalResult3);

    //var graph = buildGraph(numPeople);
    //var finalResult = major(graph);

    names = shuffleArrayByWeekNum(currentWeekNum, numPeople);
    theader += printHeadingRow (theader, numPeople, names);

    //Per row:
    var minIndex = 0;
    var timeIndex = startHr;
    for(var i = 0; i < finalResult1.length; i++)
    {
        if (i% (weekThrehold) == 0){
            var spanNum = numPeople + 1;
            var endDate = new Date();
            endDate.setDate(startDate.getDate() + 7);
            tbody += "<tr class=\'highlight\'>" + "<td colspan = \"" + spanNum + "\">";
            tbody += ' Week ' + weekNum + ' : ';
            tbody += "From " + startDate.toString().substring(0,15) + " To " + endDate.toString().substring(0,15);
            tbody += "</td>" + "</tr>";
            weekNum ++ ;
            startDate = endDate;
            timeIndex = startHr;
        }


        //first column: setting time
        tbody += "<tr>" + "<td>";
        tbody += time[timeIndex];
        tbody += "</td>"
        timeIndex++;
        //filling cells with data
        for(var j = 1; j <= numPeople; j++)
        {
            tbody += "<td>";
            var round = finalResult1[i];
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
    document.getElementById('schedule').innerHTML = theader + tbody + tfooter;
    currentPeople();
    printTables(originalTables);
    printTables2(tables2);
    cleanFields();
}

//Print current people in array so can have reference to input format of string for removing people
function currentPeople () {
    var msg = 'Current peers: ';
    names.sort();
    for (var i = 0; i < names.length; i++){
        msg+= '  ' + names[i] + '  ';
    }
    document.getElementById('currentNames').innerHTML= msg;
}

function printTable (table, name) {
    var msg = '';
    for (var i = 0; i < table.length; i++) {
        msg += table[i] + '  ';
    }
    document.getElementById(name).innerHTML= "<tr><td>" + msg+"</td></tr>";
}

function printTables (tables) {
    for (var i = 0; i < tables.length; i++){
        printTable(tables[i], 'table0' + [i+1]);
    }
}
function printTables2 (tables) {
    for (var i = 0; i < tables.length; i++){
        printTable(tables[i], 'table0' + [i+5]);
    }
}

Date.prototype.getWeek = function() {
    var onejan = new Date(this.getFullYear(), 0, 1);
    return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
}

function shuffleArrayByWeekNum (currentWeekNum, numPeople) {
    var startIndex = (Math.ceil(currentWeekNum/2) - 1 ) % numPeople;
    var newStartArray = names.slice(startIndex);
    var restArray = names.slice(0,startIndex);
    names = newStartArray.concat(restArray);
    return names;
}

function removePeople(removePerson){
    if(removePerson) {
        var removeIndex = names.indexOf(removePerson);
        if(removeIndex > -1){
            names.splice(removeIndex, 1);
        } else {
            alert('Remove name not found in list, Please refer to string format in the footer');
        }
     }
     return true;
}

function cleanFields(){
    document.getElementById('addP').value='';
    document.getElementById('removeP').value='';
}

function buildGraph (nameStr){
    var vertices =[];
    for (var i = 0; i < nameStr.length; i++){
        var vertex = buildVertex(nameStr[i],i,nameStr);
        vertices.push(vertex);
    }
    return vertices;
}

function buildVertex (name, index, nameStr){
    var vertex = {};
    vertex.id = index;
    vertex.name = name;
    vertex.visited = false;
    var neighbors = [];
    for (var i = 0; i < nameStr.length; i++){
        if (i == index) {
        } else {
            neighbors.push(nameStr[i]);
        }
    }
    vertex.neighbors = neighbors;
    return vertex;
}

//returns true if there's edge left in graph, that is,
//any vertex's neighbors still have a member in it.
//as condition check in major: while()
function edgesLeft(graph){
    for (var c = 0; c < graph.length; c++){
        if (graph[c].neighbors.length > 0){
            return true;
        }
    }
    return false;
}

//get vertex from its name in the graph, helper fn of longestNeibors
function vertexByName (graph, name){
    for (var i = 0; i < graph.length; i++){
        if (name == graph[i].name){
            return graph[i];
        }
    }
}

function longestNeibors (vertex, graph){
    var edges = vertex.neighbors;
    var max = 0;
    //-1 means not found, so paired up already
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

// add people to different tables
function divideTables () {
    var numTables = Math.ceil(names.length / numPeoplePerTable);
    var tables = new Array(numTables);

    // initialize the tables
    for (var i = 0; i < numTables; i++) {
        tables[i] = new Array();
    }

    // add people to tables
    var tableIndex = 0;
    for (var j = 0; j < names.length; j++) {
        tables[tableIndex].push(names[j]);
        tableIndex = (tableIndex + 1) % numTables;
    }

    return tables;
}


// divide tables into 2 sets for pairing
// should be different for different weeks
function partition(tables, part1, part2) {
    for (var i = 0; i < tables.length; i++) {
        if (i == tables.length - 1 && (i % 2 == 0)) {
            var mid = Math.ceil(tables[i].length/2);
            for (var j = 0; j < mid; j++) {
                part1.push(tables[i][j]);
            }
            for (var k = mid; k < tables[i].length; k++) {
                part2.push(tables[i][k]);
            }
        } else {
            if (i % 2 == 1) {
                part1.push.apply(part1, tables[i]);
            } else {
                part2.push.apply(part2, tables[i]);
            }
        }
    }
}

// should be different for different weeks
function removeSameTablePairs(tables, graph1, graph2) {

    for (var i = 0; i < tables.length; i++) {

        if (i == tables[i].length - 1 && (tables.length % 2 == 1)) {
            var mid = Math.ceil(tables[i].length/2);
            for (var j = 0; j < tables[i].length; j++) {
                var vertex;
                if (j < mid) {
                    console.log(tables[i][j]);
                    vertex = vertexByName(graph1, tables[i][j]);
                } else {
                    vertex = vertexByName(graph2, tables[i][j]);
                }
                for (var k = j + 1; k < tables[i].length; k++) {
                    var index = vertex.neighbors.indexOf(tables[i][k]);
                    if(index > -1) {
                        vertex.neighbors.splice(index, 1);
                    }
                    var vertexNeighbor;
                    if (k < mid) {
                        vertexNeighbor = vertexByName(graph1, tables[i][k]);
                    } else {
                        vertexNeighbor = vertexByName(graph2, tables[i][k]);
                    }
                    index = vertexNeighbor.neighbors.indexOf(tables[i][j]);
                    if(index > -1) {
                        vertexNeighbor.neighbors.splice(index, 1);
                    }
                }
            }
        }

        if (i % 2 == 1) {
            for (var j = 0; j < tables[i].length; j++) {
                var vertex = vertexByName(graph1, tables[i][j]);
                for (var k = j + 1; k < tables[i].length; k++) {
                    var index = vertex.neighbors.indexOf(tables[i][k]);
                    if(index > -1) {
                        vertex.neighbors.splice(index, 1);
                    }
                    var vertexNeighbor = vertexByName(graph1, tables[i][k]);
                    index = vertexNeighbor.neighbors.indexOf(tables[i][j]);
                    if(index > -1) {
                        vertexNeighbor.neighbors.splice(index, 1);
                    }
                }
            }
        } else {
            for (var j = 0; j < tables[i].length; j++) {
                var vertex = vertexByName(graph2, tables[i][j]);
                for (var k = j + 1; k < tables[i].length; k++) {
                    var index = vertex.neighbors.indexOf(tables[i][k]);
                    if(index > -1) {
                        vertex.neighbors.splice(index, 1);
                    }
                    var vertexNeighbor = vertexByName(graph2, tables[i][k]);
                    index = vertexNeighbor.neighbors.indexOf(tables[i][j]);
                    if(index > -1) {
                        vertexNeighbor.neighbors.splice(index, 1);
                    }
                }
            }
        }
    }
}

function rearrangeTables(tables) {
    var mid = Math.ceil(tables.length / 2);

    for (var i = 0; i < Math.ceil(mid / 2); i++) {
        var temp = tables[i];
        tables[i] = tables[mid - i - 1];
        tables[mid - i - 1] = temp;
    }
}

// function divideTablesWeek2(graph1, graph2) {
//     var numTables = Math.ceil(names.length / numPeoplePerTable);
//     var tables2 = new Array(numTables);
//     for (var t = 0; t < numTables; t++) {
//         tables2[t] = new Array();
//     }

//     var tableIndex = 0
//     for (var i = 0; i < names.length; i++) {
//         if (tables2[tableIndex].length == 0) {

//         }
//     }
// }

function major (graph, roundsLimit) {
    var currentWeekNum = (new Date()).getWeek();
    names = shuffleArrayByWeekNum(currentWeekNum, names.length);
    var finalResult = [];

    while (edgesLeft(graph) && roundsLimit != 0){
        var rounds = [];
        for (var d = 0; d < graph.length; d++){
            var result = [];
            //the firstV is chosen from the 1st vertex with max # of undone edges in sorted graph
            var firstV = graph[d];
            if (firstV.neighbors.length == 0 || firstV.visited) {
                continue;
            }
            //among the vertex's neighbors, return the neighbor vertex with longest neighbors
            //eg: for vertex 'Andrew' with neighbors ['Chatty','John','Mark']
            //each with neighbor.length of (3,7,4);
            //then returns 'John' as secondV in function major
            var secondIndex = longestNeibors(firstV,graph);
            if (secondIndex == -1) continue;
            var secondV = graph[secondIndex];

            var o1 = {key: firstV.name, value: secondV.name};
            var o2 = {key: secondV.name, value: firstV.name};
            result.push(o1);
            result.push(o2);
            rounds.push(result);

            //remove edges that have been paired. By removing people from the vertex's neighbor list
            var firstRemoveIndex = firstV.neighbors.indexOf(secondV.name);
            if(firstRemoveIndex > -1) {
                firstV.neighbors.splice(firstRemoveIndex, 1);
                firstV.visited = true;
            }
            var secondRemoveIndex = secondV.neighbors.indexOf(firstV.name);
            if(secondRemoveIndex > -1 ) {
                secondV.neighbors.splice(secondRemoveIndex, 1);
                secondV.visited = true;
            }
        }
        finalResult.push(rounds);
        graph.sort(function(a,b){
            return b.neighbors.length - a.neighbors.length ;
        });
        for (var k = 0; k < graph.length; k++) {
            graph[k].visited = false;
        }

        roundsLimit--;
    }
    return finalResult;
}

