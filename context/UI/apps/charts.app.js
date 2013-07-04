
require('./boot');

var highcharts = require('./vendor/highcharts'),
  moment = require('moment');


$(function () {

  // navigation
  $('.statistics a').on('click', function (e) {
    $('.statistics a').removeClass('active');
    $(this).addClass('active');
    $('#period, #months, #ranglist').fadeOut();
    var id = $(this).attr('href');
    (id == '#period') ? $('.filter-date').slideDown() : $('.filter-date').slideUp();
    if ($(id).fadeIn().is(':empty')) {
      var name = id.replace('#', '');
      $.ajax({
        type: 'GET',
        url: '/charts/'+name,
        dataType: 'json',
        success: function (res) {
          chart[name](res.data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log(jqXHR, textStatus, errorThrown);
        }
      });
    }

    return false;
  });
  
  // datepicker
  $('[name=from], [name=to]').datepicker({
    dateFormat: 'yy-mm-dd',
    changeMonth: true,
    changeYear: true,
    showWeek: true,
    firstDay: 1,
    yearRange: '2010:2013'
  });
  $('[name=from]').datepicker('setDate', moment().startOf('month').toDate());
  $('[name=to]').datepicker('setDate', moment().endOf('month').toDate());

  // filter date
  $('.filter-date button').on('click', function (e) {
    $.ajax({
      type: 'POST',
      url: '/charts/period',
      data: {
        from: $('[name=from]').val(),
        to: $('[name=to]').val()
      },
      dataType: 'json',
      success: function (res) {
        pieChart(res.data);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(jqXHR, textStatus, errorThrown);
      }
    });
    return false;
  });
  
  // charts
  var chart = {
    period: function (data) {
      $('#period').highcharts({
        chart: {
          backgroundColor: 'none',
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false
        },
        title: {
          text: 'Статистика за периода'
        },
        subtitle: {
          text: $('[name=from]').val()+' - '+$('[name=to]').val()+' - '+data.total[0].total+'лв'
        },
        tooltip: {
          formatter: function() {
            return '<b>'+ this.point.name +'</b>: '+ this.point.options.total +'лв';
          }
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              color: '#000000',
              connectorColor: '#000000',
              formatter: function() {
                return '<b>'+ this.point.name +'</b>: '
                        + parseFloat(this.percentage.toFixed(2)) +'%';
              }
            }
          }
        },
        series: [{
          type: 'pie',
          name: 'Spend',
          data: data.data
        }]
      });
    },
    months: function (data) {
      $('#months').highcharts({
        chart: {
          type: 'bar',
          backgroundColor: 'none',
          height: 2000
        },
        title: {
          text: 'Приходи: '+data.totalIncome+' | Разходи:'+data.totalSpend
        },
        subtitle: {
          text: data.months[0] + ' - ' + data.months[data.months.length-1]
        },
        xAxis: {
          categories: data.months,
          title: {
            text: null
          }
        },
        yAxis: {
          min: 0,
          title: {
            text: 'лева',
            align: 'high'
          }
        },
        tooltip: {
          enabled: false
        },
        plotOptions: {
          bar: {
            dataLabels: {
              enabled: true
            },
            lineWidth: 0,
            groupPadding: 0.15,
            pointPadding: 0.1
          }
        },
        legend: {
          enabled: false
        },
        credits: {
          enabled: false
        },
        colors: ['#AA4643', '#4572A7'],
        series: data.series
      });
    },
    ranglist: function (series) {
      $('#ranglist').highcharts({
        chart: {
          type: 'bar',
          backgroundColor: 'none',
          height: 1500
        },
        title: {
          text: 'Членове'
        },
        subtitle: {
          text: 'кой е по-по-най'
        },
        xAxis: {
          categories: ' ',
          title: {
            text: null
          }
        },
        yAxis: {
          min: 0,
          title: {
            text: 'лева',
            align: 'high'
          }
        },
        tooltip: {
          formatter: function (e) {
            return ''+this.series.name;
          },
          followPointer: true
        },
        plotOptions: {
          bar: {
            dataLabels: {
              enabled: true
            },
            groupPadding: 0,
            pointPadding: 0.15
          }
        },
        legend: {
          enabled: false
        },
        credits: {
          enabled: false
        },
        series: series
      });
    }
  }
  
  chart.period(JSON.parse($('.json').text()));
});
