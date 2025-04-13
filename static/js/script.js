$(document).ready(function() {
  // Enhanced File image preview functionality
  $("#file").on("change", function() {
    let file = this.files[0];
    if (file) {
      // Check if the file type starts with 'image/'
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file.");
        $(this).val("");           // Clear the file input
        $("#preview").hide();       // Hide the preview image if visible
        return;
      }
      // Proceed with preview if valid
      var reader = new FileReader();
      reader.onload = function(e) {
        $("#preview").attr("src", e.target.result).fadeIn();
      };
      reader.readAsDataURL(file);
    }
  });
  
  // Enhanced AJAX form submission for file upload
  $("#upload-form").on("submit", function(e) {
    // Check if a file is selected
    let fileInput = $("#file")[0];
    if (!fileInput.files[0]) {
      alert("Please select an image file before submitting.");
      e.preventDefault();
      return false;
    }
    
    // Additional file type check before submission
    let file = fileInput.files[0];
    if (!file.type.startsWith("image/")) {
      alert("The selected file is not a valid image file.");
      e.preventDefault();
      return false;
    }
    
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
          legend: { display: false }
        }
      }
    });
  }
});

