var directionService = {

  processRoute : function(routes, callback) {
        console.log("Starting to process routes");
        callback(routes);
        // try{
        //   routes.forEach(function(route){
        //     route.legs.forEach(function(leg){
        //       var steps = leg.steps;
        //       var updatedSteps = [];
        //       updatedSteps.push(steps[0]);
        //       var stepsLength = steps.length;
        //       for (var idx=1;idx<stepsLength;idx++){
        //           // var previousStep = steps[idx-1];
        //           var step = steps[idx];
        //           // console.log("Difference is::"+Math.abs(step.end_location.lat - previousStep.end_location.lat));
        //           // if(Math.abs(step.end_location.lat - previousStep.end_location.lat) > 0.2){
        //           //   updatedSteps.push(step);
        //           // }
        //           console.log("Distance text is::"+step.distance.text);
        //           var distanceMeasure = step.distance.text.split(" ");
        //           var distance = distanceMeasure[0];
        //           var unit = distanceMeasure[1];
        //           console.log("Distance is::"+distance);
        //           if(unit == 'mi' & distance > 0.1){
        //             updatedSteps.push(step);
        //           }
        //       }
        //       leg.steps = updatedSteps;
        //     });
        //   });
        //   callback(routes);
        // }
        // catch(e){
        //   console.log("Error occured while processing route::"+e);
        //   callback(routes);
        // }

  }

}

module.exports = directionService;
