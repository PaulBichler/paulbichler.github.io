//global variables
let x0, vx0, ax, y0, vy0, ay;
let timeOfFlight, highestPoint;
let groundCheck, interval, iterations;
let chart;

//event that triggers when the page is finished loading
document.addEventListener('DOMContentLoaded', (event) => {
    init();                              //initialise the calculations (reset)
    printChart(calculateTrajectory());   //print the chart

    //event that triggers when the user clicks on the "update" button
    document.getElementById("update").onclick = function() {
        chart.destroy();    //destroys the old chart
        //same functions as above, they get called whenever this event occurs
        init();
        printChart(calculateTrajectory());
    };
});

//initialiser function (resets the global variables used in the calculations)
function init() {
    //get the user input from the input fields and store them in the global variables
    x0 = parseFloat(document.getElementById("x0").value);                   //initial x-position
    vx0 = parseFloat(document.getElementById("vx0").value);                 //initial x-velocity
    ax = parseFloat(document.getElementById("ax").value);                   //acceleration on the x-axis
    y0 = parseFloat(document.getElementById("y0").value);                   //initial y-position
    vy0 = parseFloat(document.getElementById("vy0").value);                 //initial y-velocity
    ay = parseFloat(document.getElementById("ay").value);                   //acceleration on the y-axis
    groundCheck = document.getElementById("groundCheck").checked;           //check-state of the "stop on ground?" checkbox (true or false)
    interval = parseFloat(document.getElementById("interval").value);       //time interval
    iterations = parseInt(document.getElementById("iterations").value);     //iterations (how many "points" should be calculated)
    document.getElementById('trajResults').innerHTML = '';                  //resets the result text
}

//function to generate the dataset (sets of x and y values) that will be displayed by the chart
function calculateTrajectory() {
    let dataset = [];       //declare an empty array
    let grounded = false;   //boolean that checks whether the "projectile" has hit the "ground" (y = 0)
    let time = 0;           //starting time

    //while the projectile hasn't hit the ground AND there are still iterations to be made, the loop-body will be executed
    while(!grounded && iterations > 0) {
        let x = _x(time);   //call the _x(t) function with (t = time) and store the result in the variable x
        let y = _y(time);   //call the _y(t) function with (t = time) and store the result in the variable y

        //if y is less or equal to 0 (if the projectile hit or passed the ground) AND
        //if the dataset array has more than one element (to prevent the program from terminating at the start) AND
        //if the user has checked the "stop on ground?" checkbox (this code is only executed if that is the case)
        if(y <= 0 && dataset.length > 1 && groundCheck) {
            grounded = true;                            //grounded is set to true (this stops the next iteration of the loop)
            timeOfFlight = _timeOfFlight(vy0, ay);      //executes _timeOfFlight function (calculates the time it takes for the projectile to hit the ground)
            x = _x(timeOfFlight);                       //calculates the x value at t = timeOfFlight and overrides the x variable with the result (x = distance travelled)
            y = _y(timeOfFlight);                       //calculates the y value at t = timeOfFlight (could also be set to 0) and overrides the y variable with the result
            highestPoint = _highestPoint(vy0, ay);      //calculates the highest point of the projectile

            // prints the above calculated results to the screen (the values are rounded down to 2 decimals)
            document.getElementById('trajResults').innerHTML += '<h3>Results:</h3>' +
                                                                'Distance Travelled: &emsp;' + x.toFixed(2) + ' m' +
                                                                '<br>Time of Flight: &emsp; &emsp;' + timeOfFlight.toFixed(2) + ' s' +
                                                                '<br>Highest Point: &emsp; &emsp;' + highestPoint.toFixed(2) + ' m';
        }

        dataset.push({x: x, y: y});                     //adds the the calculated x and y values to the dataset

        time += interval;                               //increments the time variable with the interval input of the user
        iterations--;                                   //decrements the iterations set by the user
    }//loop-end

    //returns the dataset array, containing all the calculated coordinates
    return dataset;
}


function _x(t) {
    //calculates the the x value for the given time, using the global variables set by the user, and returns the result
    return (x0 + (vx0 * t) + (0.5 * ax * Math.pow(t, 2)));
}


function _y(t) {
    //calculates the the y value for the given time, using the global variables set by the user, and returns the result
    return (y0 + (vy0 * t) + (0.5 * ay * Math.pow(t, 2)));
}


//calculates the time of flight of the projectile
function _timeOfFlight(vy0, ay) {
    if(ay === 0) {
        //if ay = 0, the value 0 is returned and the function is terminated
        //this is needed to prevent a possible division by 0
        return 0;
    }

    //returns the result
    return ((2 * vy0) / (-1 * ay));
}


//calculates the highest point of the projectile
function _highestPoint(vy0, ay) {
    //prevents division by 0
    if(ay === 0) {
        return _y(0);
    }

    //returns a function call to _y(t) with the time it takes to reach the highest point as parameter
    //the _y() function then calculates the y value at that time
    return _y((vy0 / (-1 * ay)));
}

//function to print the chart to the screen (the parameter data will be the dataset-array that gets returned by the function calculateTrajectory())
function printChart(data) {
    const trajChart = document.getElementById("trajChart");     //gets the container for the chart (so it knows where to print it)
    trajChart.width = 900;                                      //sets the width of the chart
    trajChart.height = 600;                                     //sets the height of the chart

    //generates the chart
    chart = new Chart(trajChart, {
        type: 'line',                           //linear chart
        data: {                                 //data to display
            datasets: [{                        //datasets (the chart can display multiple datasets)
                label: 'Trajectory',            //label for the dataset
                data: data                      //Our data
            }]
        },
        options: {                              //additional options
            scales: {
                xAxes: [{
                    type: 'linear',
                    position: 'bottom'
                }]
            }
        }
    });
}