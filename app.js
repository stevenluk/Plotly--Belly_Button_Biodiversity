function Plot(id){
    //read local data
    d3.json("data/samples.json").then((importdata) =>{
        
        //set variables for future usage
        var data=importdata;
        var filter=data.samples.filter(input => input.id.toString()===id)[0];
        var filter2=data.metadata.filter(input => input.id.toString()===id)[0];
        
        //get the first 10 sample values
        var samplevalue=filter.sample_values.slice(0,10).reverse();
        
        //get otuids and labels for the first ten data
        var otuids=filter.otu_ids.slice(0,10);
        newotuids=otuids.map(ids =>"OTU" +ids)
        var label=filter.otu_labels.slice(0,10);

        //set characteristics for bar chart
        var trace1={
            x:samplevalue,
            y:newotuids,
            text: label,
            type:"bar",
            orientation:"h"
        };

        var chartdata=[trace1];

        var layout={
            title:"Top 10 OTUs",
        
        }

        //plot bar chart
        Plotly.newPlot("bar",chartdata,layout);

        //set bubble plot characteristics
        var trace2={
            x:filter.otu_ids,
            y:filter.sample_values,
            text:filter.otu_labels,
            mode:"markers",
            marker:{
                size:filter.sample_values,
                color:filter.otu_ids,
                
            }
           
        };
        var chartdata2=[trace2];
        var layout2={
            title:"OTUs",
            xaxis:{title:"OTU IDs"},
            yaxis:{title:"Sample Values"},
           

        };

        
        //plot bubble plot
        Plotly.newPlot("bubble",chartdata2,layout2);

    
        // Enter a value as the frequency of the input data
        var level = filter2.wfreq;
        
        // Trig to calc meter point
        var degrees = 180 - level*20,
            radius = .5;
        var radians = degrees * Math.PI / 180;
        var x = radius * Math.cos(radians);
        var y = radius * Math.sin(radians);
        
        // Path: may have to change to create a better triangle
        var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
            pathX = String(x),
            space = ' ',
            pathY = String(y),
            pathEnd = ' Z';
        var path = mainPath.concat(pathX,space,pathY,pathEnd);
        
        var data3 = [{ type: 'scatter',
            x: [0], y:[0],
            marker: {size: 28, color:'DB5F59'},
            showlegend: false,
            name: 'Washing Frequency',
            text: level,
            hoverinfo: 'text+name'},
            { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
            rotation: 90,
            text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
            textinfo: 'text',
            textposition:'inside',
            marker: {colors: ['rgba(0, 112, 17, 1)', 'rgba(0, 143, 21, 1)', 'rgba(0, 179, 27, 1)',
            'rgba(0, 219, 33, 1)', 'rgba(5, 255, 43, 1)', 'rgba(66, 255, 95, 1)', 
            'rgba(97, 255, 121, 1)', 'rgba(122, 255, 142, 1)', 'rgba(173, 255, 186, 1)', 
            'rgba(255, 255, 255, 0)']},
            labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
            hoverinfo: 'label',
            hole: .5,
            type: 'pie',
            showlegend: false
            }];
        
        var layout3 = {
            shapes:[{
                type: 'path',
                path: path,
                fillcolor: 'DB5F59',
                line: {
                    color: 'DB5F59'
                      }
                    }],
                title: {
                    text:'Belly Button Weekly Washing Frequency'.bold()

                        }, 
                
                xaxis: {zeroline:false, showticklabels:false,
                             showgrid: false, range: [-1, 1]},
                yaxis: {zeroline:false, showticklabels:false,
                             showgrid: false, range: [-1, 1]}
                };
        
        //plot gauge plot
        Plotly.newPlot('gauge', data3, layout3);
    }
    )
}

//filter input data and show all the information
function metadatainfo(id){
    d3.json("data/samples.json").then((metainput) =>{
        var metadata=metainput.metadata;
    
        var info=metadata.filter(input => input.id.toString()===id)[0];
     
        var demographicinfo=d3.select("#sample-metadata");
        demographicinfo.html("");
        Object.entries(info).forEach(([key,value]) =>{
            demographicinfo.append("h5").text(key+": "+value);

        })
    }
    )
}

//create all the options and use the first data as the initial plot
function init(){
    var button=d3.select("#selDataset");
    d3.json("data/samples.json").then((data) =>{
        data.names.forEach(function(name){
            button.append("option").text(name).property("value");

        }
        )
        Plot(data.names[0]);
        metadatainfo(data.names[0]);
       
    }
    )
}

//create function for information change corresponding to user selection
function optionChanged(id){
    Plot(id);
    metadatainfo(id);

}

//initiate the plots
init();