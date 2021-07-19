    var slideIndex = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    var slideId = ["mySlides1", "mySlides2", "mySlides3", "mySlides4", "mySlides5", "mySlides6", "mySlides7", "mySlides8", "mySlides9", "mySlides10", "mySlides11", "mySlides12"];
    showDivs(1, 0);
    showDivs(1, 1);
    showDivs(1, 2);
    showDivs(1, 3);
    showDivs(1, 4);
    showDivs(1, 5);
    showDivs(1, 6);
    showDivs(1, 7);
    showDivs(1, 8);
    showDivs(1, 9);
    showDivs(1, 10);
    showDivs(1, 11);
    
    function plusDivs(n, no) {
      showDivs(slideIndex[no] += n, no);
    }
    
    function showDivs(n, no) {
      var i;
      var x = document.getElementsByClassName(slideId[no]);

      if(x.length == 0)
        return;

      if (n > x.length) {
        slideIndex[no] = 1
      }
      if (n < 1) {
        slideIndex[no] = x.length
      }
      for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
      }
      x[slideIndex[no] - 1].style.display = "block";
    }