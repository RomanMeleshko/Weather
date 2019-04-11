import $ from "jquery";

$( document ).ready(function() {
    
    var body = $("body");  
    var global = $(".global");
    var city = $(".city");
    
    function setNewLeft(elem, global) { // пердвигаем виджет на левую сторону
      
      var width = $(elem).width() / 2;
      $(global).css({"left": width});  
    };
    setNewLeft( body, global );
    
     function time() {  // функция для отображения времени  и даты
        var time = new Date();

        var dayWeek = time.getDay();
        var dayMonth = time.getMonth();
        var year = time.getFullYear();

        var resultWeek, resultMonth;

        var arr = ["Понедельник","Вторник","Среда","Четверг","Пятница","Суббота","Воскресенье"];
        for(var i = 0;i < arr.length;i++){
            
            if(arr[dayWeek]) resultWeek = arr[dayWeek - 1];
        }
        var arrMonth = ["ЯНВ.","ФЕВ.","МАР.","АПР.","МАЙ.","ИЮН.","ИЮЛ.",
                        "АВГ.","СЕН.","ОКТ","НОЯ.","ДЕК."];
        for(var j = 0;j < arrMonth.length;j++){
            
            if(arrMonth[dayMonth]) resultMonth = arrMonth[dayMonth];
        }
        var hours = time.getHours();
        var mint = time.getMinutes();

       $("#dayWeek").text(resultWeek);
       $("#dayMonth").text(resultMonth);
       $("#year").text(year);

       $(".hours").text(hours);
       $(".minute").text(mint);

    }

     setInterval(time, 1000);
    
    function gson(city) {
        
        $("input").keypress(function(eventObject) {
            
            if(eventObject.which === 13) { // обработка по клавише Enter
              
              isLoading();  
              
                $.getJSON({  // парсим JSON в обекты JS
                  
                   url: "current.city.list.json", // получаем json из корня проекта
                    success: function(data) {
                       
                       var cityNameFromUser = $("input").val(); 
                       
                        for(var key in data){   // проходим по каждому ключу
                           
                            if(data[key].country === "UA" && data[key].name.toLowerCase() == cityNameFromUser.toLowerCase()){
                        
                              var idCity = data[key].id;
                            
                              city.text( cityNameFromUser ); 
                            //  isProper( idCity );
                              
                            //   setInterval(function(){
                                   
                                  isProper( idCity ); 
                                   
                            //   }, 10000);
                            }
                        }
                    },
                    complete: function() {
                       
                       $(".loading").removeClass("styleElem");
                    },
                    error: function() {
                       
                      console.log("Error of data");
                    }
                });
            }
        });
    }
    gson( city );
    
    function isProper(id) { //функция отправки запроса  
     // alert(22);
        $.get(
               
           "https://api.openweathermap.org/data/2.5/weather", //куда идет запрос

           {
               "id": id,  // id конкретного города
               "appid" : "ce42c3391b1f5260c642a5eb2947e70d" // ключ
            },
            function(data) { 
              
             $("#temperature").html(Math.round(data.main.temp-273)+'&#176;'); 
             $("#humidity > span").text(data.main.humidity+'%'); 
             $("#pressure > span").text(Math.round(data.main.pressure * 0.00750063755419211*100 ) + "");
             var result = $("#visibility > span").text(data.visibility/1000 + "m"); 
             
             if( isNaN(result) ) {  //проверка на NaN
                 
                 $("#visibility > span").text("10m");
                }
            }      
        );

          setInterval(function(){
                                   
               isProper(id);      
                                   
           }, 6000000);
       
    }
    
    
    var elemInput = $("input");
    
    function isClick(elem) { //функция очистки поля для ввода
        
        elem.on("click", function(){
           
           elem.val("");
        });
    }
    isClick( elemInput );
    
    function isLoading() {  //функция для отображения стрелок загрузки
        
      var newElem = $("<div></div>").attr("class", "loading");
       
       newElem.addClass("styleElem");
       
       $(".UpBlock").append(newElem);
    }
    
     
    function toolType(param1, param2) { //Функция для ввывода подсказок при навидении мышки.
   
     var createElem = $("<p></p>").text(param2);
    
      $(param1).on("mousemove", function(event){

        $(".global").append(createElem);

         var x = event.pageX / 2;
         var y = event.pageY / 2;

         createElem.addClass("tooltype");
         createElem.css({"top": y + -270 + "px", 
                        "left": x + -300 + "px",
                        "visibility": "visible"});
         
         event.preventDefault();
         
        if(x && y > 0) {
            
          setTimeout(function(){
               createElem.removeClass("tooltype");
            }, 8000);  
        }
        
        });
        
        $(param1).on("mouseout", function(){
          
          createElem.removeClass("tooltype");
        });
        
        
    };
    
    var text = "Вводите название городов английскими буквами";
    var elemFromDom = $("input"); 
    
    toolType(elemFromDom, text);
});