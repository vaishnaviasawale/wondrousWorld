const searchFun = () => {
    let filter = document.getElementById('myInput').value.toUpperCase();
    let All = document.getElementById('allSearch');
    let allCards = All.getElementsByClassName('card');
    for(var i = 0; i < allCards.length; i++) {
      let textCard = allCards[i].getElementsByClassName('text')[0].innerText;
      if (textCard.toUpperCase().indexOf(filter) > -1) {
        allCards[i].style.display = "";
      } else {
        allCards[i].style.display = "none";
      }
    }
  }