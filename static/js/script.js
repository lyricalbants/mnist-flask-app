$(document).ready(function() {
  // File image preview functionality
  $("#file").change(function() {
    if (this.files && this.files[0]) {
      var reader = new FileReader();
      reader.onload = function(e) {
        $("#preview").attr("src", e.target.result).fadeIn();
      };
      reader.readAsDataURL(this.files[0]);
    }
  });
  
  // AJAX form submission for file upload
  $("#upload-form").submit(function(e) {
    e.preventDefault();
    var formData = new FormData(this);
    $("#result").html('<div class="alert alert-info">Predicting…</div>');
    $.ajax({
      url: "/predict",
      type: "POST",
      data: formData,
      contentType: false,
      processData: false,
      success: function(data) {
        if (data.error) {
          $("#result").html('<div class="alert alert-danger">' + data.error + '</div>');
        } else {
          displayResult(data);
          renderChart(data.probabilities);
        }
      },
      error: function(xhr, status, error) {
        $("#result").html('<div class="alert alert-danger">An error occurred: ' + error + '</div>');
      }
    });
  });
  
  // Handle clicks on sample images
  $(".sample-img").on("click", function() {
    var sampleFilename = $(this).data("sample");
    $("#result").html('<div class="alert alert-info">Predicting sample...</div>');
    $.ajax({
      url: "/predict_sample",
      type: "GET",
      data: { image: sampleFilename },
      success: function(data) {
        if(data.error) {
          $("#result").html('<div class="alert alert-danger">' + data.error + '</div>');
        } else {
          displayResult(data);
          renderChart(data.probabilities);
        }
      },
      error: function(xhr, status, error) {
        $("#result").html('<div class="alert alert-danger">An error occurred: ' + error + '</div>');
      }
    });
  });
  
  // Function to display prediction result
  function displayResult(data) {
    var probabilityText = "";
    data.probabilities.forEach(function(prob, index) {
      probabilityText += "Digit " + index + ": " + (prob * 100).toFixed(2) + "%<br>";
    });
    $("#result").html(
      '<div class="alert alert-success">' +
        '<h4>Predicted Digit: ' + data.predicted_digit + '</h4>' +
        probabilityText +
      '</div>'
    );
  }
  
  // Function to render probability chart using Chart.js
  var chartInstance = null;
  function renderChart(probabilities) {
    $("#probabilityChart").show();
    var ctx = document.getElementById('probabilityChart').getContext('2d');
    if (chartInstance) {
      chartInstance.destroy();
    }
    chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
        datasets: [{
          label: 'Probability (%)',
          data: probabilities.map(function(p) { return (p * 100).toFixed(2); }),
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: 'Probability (%)'
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }
});

