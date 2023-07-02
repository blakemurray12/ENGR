$(document).ready(function() {
  var x = 1;

  $('#addRunButton').click(function() {
    x++;

    var row = $('<tr>');
    row.append($('<td>').text(x));  
    row.append($('<td>').html('<input type="text" id="fromMH">'));
    row.append($('<td>').html('<input type="text" id="toMH">'));
    row.append($('<td>').html('<input type="text" id="d' + x + '">'));
    row.append($('<td>').html('<input type="text" id="n' + x + '">'));
    row.append($('<td>').html('<input type="text" id="s' + x + '">'));
    row.append($('<td>').html('<input type="text" id="uf' + x + '">'));
    row.append($('<td>').html('<span id="result' + x + '"></span>'));
    row.append($('<td>').html('<span id="eightyresult' + x + '"></span>'));
    row.append($('<td>').html('<span id="remcap' + x + '"></span>'));
    row.append($('<td>').html('<span id="pfresult' + x + '"></span>'));

    $('#runTable').append(row);
  });

  $('#calculateButton').click(function() {
    for (var z = 1; z <= x; z++) {
      var d = parseFloat($('#d' + z).val());
      var n = parseFloat($('#n' + z).val());
      var s = parseFloat($('#s' + z).val());
      var uf = parseFloat($('#uf' + z).val());
      var sloRaise = Math.pow(s, 0.5);

      if (!isNaN(d) && !isNaN(n) && !isNaN(s)) {
        if (n >= 0 && n <= 1 && s >= 0 && s <= 0.2 && d > 3 && d < 60) {
          var pf = [];
          var depthOfPipe = [];
          var radians = [];
          var area = [];
          var perim = [];
          var hydRad = [];
          var hydRadRaise = [];
          var velocity = [];
          var Qvalues = [];
          var flowRateDict = {};

          var v = 0;
          while (v < 1) {
            v = v + 0.001;
            pf.push(v);
          }

          for (var i = 0; i < pf.length; i++) {
            depthOfPipe[i] = Math.round(pf[i] * d * 100) / 100;
            if (depthOfPipe[i] < d / 2) {
              value = Math.round((Math.PI - 2 * Math.asin(1 - (2 * depthOfPipe[i]) / d)) * 100) / 100;
              radians.push(value);
            } else {
              value = Math.round((Math.PI + 2 * Math.asin((2 * depthOfPipe[i]) / d - 1)) * 100) / 100;
              radians.push(value);
            }
            area.push(((radians[i] - Math.sin(radians[i])) * ((d / 12) ** 2) / 8));
            perim.push((radians[i] * (d / 12)) / 2);
            hydRad.push(area[i] / perim[i]);
            hydRadRaise.push(Math.pow(hydRad[i], 0.67));
            velocity.push((1.49 / n) * hydRadRaise[i] * sloRaise);
            Qvalues.push(Math.round(448.831 * velocity[i] * area[i] * 100) / 100);
            flowRateDict[depthOfPipe[i]] = Qvalues[i];
          }

          var QMax = Math.max.apply(Math, Qvalues);
          var EightyFull = Math.round((0.8 * QMax) * 100) / 100;
          var remainingCap = Math.round((QMax - uf) * 100) / 100;

          var depthOfPipeForUserFlow = null;
          var pfvalue = null;
          for (var i = 1; i < depthOfPipe.length; i++) {
            if (Qvalues[i] === uf) {
              depthOfPipeForUserFlow = depthOfPipe[i];
              pfvalue = 100 * depthOfPipe[i] / d;
              break;
            } else if (Qvalues[i] > uf) {
              var interpolationFactor = (uf - Qvalues[i - 1]) / (Qvalues[i] - Qvalues[i - 1]);
              depthOfPipeForUserFlow = depthOfPipe[i - 1] + interpolationFactor * (depthOfPipe[i] - depthOfPipe[i - 1]);
              pfvalue = Math.round((100 * depthOfPipe[i] / d)*100)/100;
              break;
            }
          }

          if (depthOfPipeForUserFlow !== null) {
            console.log('Depth of Pipe for User Flow:', depthOfPipeForUserFlow);
          } else {
            console.log('No Depth of Pipe found for User Flow:', uf);
          }

          $('#result' + z).text(QMax);
          $('#eightyresult' + z).text(EightyFull);
          $('#remcap' + z).text(remainingCap);
          $('#pfresult' + z).text(pfvalue);
        } else {
          alert('Invalid input values for n, s, or d');
          
        }
      }
    }
  });
});

