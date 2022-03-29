// Task 1: Defining the functionality of the submit button


var submit_btn=document.getElementById('submit_btn');
var questionSubject= document.getElementById('subject');
var questionDescription=document.getElementById('questions');
var questionList=document.getElementById('questionList');
var toggleDisplay=document.getElementById('toggleDisplay');
var respondQuesContainer=document.getElementById('respondQues');
var resolveHolder=document.getElementById('resolveHolder');
var respondAns=document.getElementById('respondAns');
var commentHolder=document.getElementById('commentHolder');
var pickName=document.getElementById('pickName');
var pickComment=document.getElementById('pickComment');
var commentBtn=document.getElementById('commentBtn');
var respondedAns=document.getElementById('respondedAns');
var searchQuestion=document.getElementById('searchQuestion');
var upvote=document.getElementById('upvote');
var downvote=document.getElementById('downvote');
var resolveQuesBtn=document.getElementById('resolveQuestion')
var question_btn=document.getElementById('question_btn');



function onPageReLoad()  // Show all the existing question  from local storage on page refresh
{


  var allQuestion= fetchAllQuestion();  // Fetch all existing questions from local storage 
  allQuestion=allQuestion.sort(function(firstQue, SecondQue){
      if(firstQue.ifFav)
      {
          return -1
      }
      else
      {
          return 1;
      }

  });

  allQuestion.forEach(function(question)
  {
      addQuesToLeftPane(question);
  });

}

onPageReLoad();

question_btn.addEventListener('click',showRightPane);



searchQuestion.addEventListener("change", function(event){

    event.target.blur();
    findQuestions(event.target.value);
    
    
});



function findQuestions(found) // Search Question 
{
    
    if(found)
    {

      var allQuestions=fetchAllQuestion();
      var targetResult=allQuestions.filter(function(question)
      {  
        if(question.title.includes(found))
        {
            return true;
        }
        
      });

       if(targetResult.length)
      {
          clearLeftPane();
          targetResult.forEach(function(question)
          {
            addQuesToLeftPane(question);
          });
          
      }
     
      else
      {   
        clearLeftPane();
        printNoResult()
      }
    }

    else
    {
        clearLeftPane();
        onPageReLoad();
    }

}


  function clearLeftPane()    // To clear the left pane area
  {
    questionList.innerHTML="";
  }


  function printNoResult()
  {
    var heading=document.createElement('h2');
    heading.innerHTML="No result found!";
    questionList.append(heading);
  }

function fetchAllQuestion()
{

var allQuestion=localStorage.getItem('questions');
if(allQuestion)
{
    allQuestion=JSON.parse(allQuestion);
}
else
{
    allQuestion=[];
}

 return allQuestion;

}

function varifySubmitValue()
{
   
}

submit_btn.addEventListener('click', onQuestionSubmit); // Adding event Listener on the submit button

function onQuestionSubmit()
{
    

    var question={
        title: questionSubject.value,
        description: questionDescription.value,
        responses:[],
        upvote:0,
        downvote:0,
        dateOfOrigin: Date.now(),
        ifFav:false,
    };
    
    storeQuestion(question);
    addQuesToLeftPane(question);
    clearQuestionForm();
}

function storeQuestion(newQuestion)    // function to store the question on the local storage
{
 
 var allQuestion= fetchAllQuestion();   // Fetch the older questions; 

  allQuestion.push(newQuestion);
 localStorage.setItem('questions', JSON.stringify(allQuestion)); 
}

function addQuesToLeftPane(newQuestion)  // Defination of the add Question to the left pane of the page
{
    var questionBox=document.createElement('div');
    questionBox.setAttribute('id', newQuestion.title);
    questionBox.style.marginTop="10px";
    questionList.appendChild(questionBox);
    questionBox.style.padding="2px";
    questionBox.style.borderBottom="1px solid black";
    questionBox.style.cursor="pointer";
    var questionTitle=document.createElement('h4');
    questionTitle.innerHTML=newQuestion.title;
    var questionBody=document.createElement('p');
    questionBody.innerHTML=newQuestion.description;
    questionBox.appendChild(questionTitle);
    var lineBreak=document.createElement('br');
    questionBox.appendChild(lineBreak);
    questionBox.appendChild(questionBody);
    questionBox.appendChild(lineBreak);
    var upvoteValue=document.createElement('h4');
    upvoteValue.style.display="inline-block";
    upvoteValue.innerHTML="Upvote: "+newQuestion.upvote+"&nbsp&nbsp&nbsp&nbsp&nbsp";
    questionBox.appendChild(upvoteValue);
    var downVoteValue=document.createElement('h4');
    downVoteValue.style.display="inline-block";
    downVoteValue.innerHTML="Downvote: "+newQuestion.downvote+"&nbsp&nbsp&nbsp";
    questionBox.appendChild(downVoteValue);
  //  var dateOfOrigin=document.createElement('p');
  //  dateOfOrigin.style.display="inline-block";
  //  dateOfOrigin.innerHTML="Created At: " + new Date(newQuestion.dateOfOrigin).toLocaleString('USA');
  //  questionBox.appendChild(dateOfOrigin);

    var timeDuration=document.createElement('p');
    timeDuration.style.display="inline-block";
    questionBox.appendChild(timeDuration);
    timeDuration.innerHTML="Posted "+updateTimeDuration(timeDuration)(newQuestion.dateOfOrigin)+"ago";

    var favBtn=document.createElement('button');
    favBtn.style.display="block";
    if(newQuestion.ifFav)
       {
        favBtn.innerHTML="Remove Fav";
       }
       else
       {
        favBtn.innerHTML="Add to fav";
       }
    favBtn.setAttribute('class','BTN');
    questionBox.appendChild(favBtn);
    favBtn.addEventListener('click', addRemoveFav(newQuestion));



    questionBox.addEventListener('click', onQuestionClick(newQuestion));
    
    

}

function addRemoveFav(newQuestion)
{
   return function(event)
   {
       event.stopPropagation();
        newQuestion.ifFav = !newQuestion.ifFav;
       updateVoteValue(newQuestion);

       if(newQuestion.ifFav)
       {
           event.target.innerHTML="Remove Fav";
       }
       else
       {
           event.target.innerHTML="Add to fav";
       }
         
   }

}






function updateTimeDuration(timeDuration)
{
   
    return function(time)
    {
        setInterval(function()
        {
         timeDuration.innerHTML="Posted "+convertTimeDuration(time)+" ago";

        },1000);

        return convertTimeDuration(time);
    }

   
}

function convertTimeDuration(time)
{
    var currentTime=Date.now();
    var totalTimeElapsed=currentTime- new Date(time).getTime();
    
    var totalSec= Math.floor(totalTimeElapsed/1000);
    var totalMin=Math.floor(totalSec/60);
    var totalHour=Math.floor(totalMin/60);

  //  console.log(totalSec+" "+totalMin+" "+totalHour);
    if(totalHour===0 && totalMin===0)
    {
        return totalSec+" seconds";
    }
   else if(totalHour===0 && totalSec>59)
   {
       return totalMin+" minutes";
   }
  else if(totalMin>59 )
  {
      return totalHour+" hours";
  }

  //return totalHour+"Hour "+totalMin+"Minutes "+totalSec+"Second ";
}



function clearQuestionForm()  //clear the value of question description as well as subject
{

    questionSubject.value=" ";
    questionDescription.value=" ";

}



function onQuestionClick(newQuestion)  // Listen for click on questions
{
 

     return function()  // Due to clouser we can access the newQuestion variable
     {
       

      

       hideQuestionPanel();     // Hide the Question Panel
       
       clearQuestionContainer(); //clear the question container
      
       clearResponseContainer();
        
       showQuestionDetails();   // show on clicked questions
      
       sortResponses(newQuestion.responses);

    //   newQuestion.responses.forEach(function(response)
    //   {
     //      addResponseInPanel(response);
     //  });


       addQuestionToRight(newQuestion);   // Add question to the right


       commentBtn.onclick= onResponseSubmit(newQuestion) ;
      // commentBtn.addEventListener('click', onResponseSubmit , { once: true});

      //upvote.addEventListener('click', upVoteQues(newQuestion));

      upvote.onclick=upVoteQues(newQuestion);

      downvote.onclick=downVoteQues(newQuestion);

     // downvote.addEventListener('click', downVoteQues(newQuestion));

     resolveQuesBtn.addEventListener('click', deleteQuesInLeftPane(newQuestion));

       
     }


}


function sortResponses(responses)
{
  
    var allResponses=responses.sort(function(res1,res2){

        if(res1.favResponse)
        {
            return -1;
        }
        else
        {
            return 1;
        }
    });
 
   allResponses.forEach(function(responses)
   {
       addResponseInPanel(responses);
   });

}



function deleteQuesInLeftPane(newQuestion)   // To remove the question from left question Panel
{
   return function()
   {
     
    var allQuestion=fetchAllQuestion();
   var updatedQuestion= allQuestion.filter(function(question){
           if(newQuestion.title===question.title)
           {
            return false;
           }

           return true;
    });

   localStorage.setItem('questions',JSON.stringify(updatedQuestion));
   removeQuestionValues(newQuestion.title);
   showRightPane();



   }

}

function showRightPane()   // to redisplay the question submit form 
{
   
   toggleDisplay.style.display="block";
   respondQuesContainer.style.display="none";
   respondedAns.style.display="none";
   resolveHolder.style.display="none";

}

function removeQuestionValues(question)
{
    var questionBox=document.getElementById(question);
    questionBox.style.display="none";

}






function upVoteQues(newQuestion)
{
   
    return function()
    {
   newQuestion.upvote++;
   updateVoteValue(newQuestion);
   showVoteValue(newQuestion);
    }

   

}

function downVoteQues(newQuestion)
{
      return function()
      {
      newQuestion.downvote++;
      updateVoteValue(newQuestion);
      showVoteValue(newQuestion);
      }
    

}


function showVoteValue(newQuestion)
{
    var questionBox=document.getElementById(newQuestion.title);
    //console.log(questionBox.childNodes);
    questionBox.childNodes[3].innerHTML="Upvote: "+newQuestion.upvote+"&nbsp&nbsp&nbsp&nbsp&nbsp";
    questionBox.childNodes[4].innerHTML="Downvote: "+newQuestion.downvote+"&nbsp&nbsp&nbsp";

}


function hideQuestionPanel()
{

    toggleDisplay.style.display='none';
}



function showQuestionDetails()  // Display Question Details
{

    respondQuesContainer.style.display="block";
    resolveHolder.style.display="block";
    respondAns.style.display="block";
    commentHolder.style.display="block";
    respondedAns.style.display="block";


}


function addQuestionToRight(question)
{
var questionHeading=document.createElement('h2');
var lineBreak=document.createElement('br');
questionHeading.innerHTML="Questions: ";
questionHeading.appendChild(lineBreak);
respondQuesContainer.appendChild(questionHeading);
var questionTitle=document.createElement('h3');
questionTitle.innerHTML=question.title;
respondQuesContainer.appendChild(questionTitle);
questionTitle.style.marginBottom="8px";
var questionBody=document.createElement('p');
questionBody.innerHTML=question.description;
respondQuesContainer.appendChild(questionBody);
var lineBreak=document.createElement('br');
respondQuesContainer.appendChild(lineBreak);
var dateOfOrigin=document.createElement('p');
//dateOfOrigin.style.display="inline-block";
dateOfOrigin.innerHTML="Created At: " + new Date(question.dateOfOrigin).toLocaleString('USA');
respondQuesContainer.appendChild(dateOfOrigin);   

respondQuesContainer.style.backgroundColor="#e7e7e7"; 
respondQuesContainer.style.padding="5px";
    
}


function onResponseSubmit(newQuestion)
{
   
    return function()
    {
        var responses={
            name:pickName.value,
            description:pickComment.value,
            timeOfResponse: Date.now(),
            favResponse:false,

        }

        saveResponse(newQuestion, responses);
        addResponseInPanel(responses);
        clearCommentsValue();
    }
}  


function updateVoteValue(newQuestion)
{
  var allQuestion=fetchAllQuestion();
   var updatedQuestion=allQuestion.map(function(question){
          if(newQuestion.title===question.title)
          {
              return newQuestion;
          }

         return question;
   });

   localStorage.setItem('questions', JSON.stringify(updatedQuestion));

}

function saveResponse(updatedQuestion,responses)
{   
      
   var allQuestion=fetchAllQuestion();

   var revisedQuestion=allQuestion.map(function(question)
   {

    if(updatedQuestion.title===question.title)
    {
        question.responses.push(responses); 
    }
    
    return question;
   });

   localStorage.setItem('questions', JSON.stringify(revisedQuestion));
}


function clearQuestionContainer()
{
    respondQuesContainer.innerHTML=" ";
}


function clearResponseContainer()
{
    respondAns.innerHTML=" ";
}

function clearCommentsValue()
{
    pickName.value="";
    pickComment.value="";
}

function addResponseInPanel(responses)   // Display responses in Response Section
{

   var commentatorName=document.createElement('h4');
   commentatorName.innerHTML=responses.name;
   commentatorName.style.marginBottom="4px";
   respondAns.appendChild(commentatorName);
   var commentBody=document.createElement('p');
   respondAns.appendChild(commentBody);
   commentBody.innerHTML=responses.description;
   commentBody.style.marginBottom="8px"; 
   commentBody.style.borderBottom="1px dotted black";
  
  

  // var timeOfResponse=document.createElement('p');
  // timeOfResponse.innerHTML="Respond At: " + new Date(responses.timeOfResponse).toLocaleString('USA');
  // commentBody.appendChild(timeOfResponse);

   var timeDuration=document.createElement('p');
   timeDuration.innerHTML="Posted "+updateTimeDuration(timeDuration)(responses.timeOfResponse)+"ago";
   commentBody.appendChild(timeDuration);
  // var favBtn=document.createElement('button');
  // favBtn.addEventListener('click', addRemoveFavResp(responses));
  // favBtn.innerHTML="Add to Fav";
 //  commentBody.appendChild(favBtn);
 //  favBtn.style.display="block";
 //  favBtn.setAttribute('class', "BTN");
   

   respondAns.style.backgroundColor="#e7e7e7";
  
 //  console.log(newQuestion);

}



function addRemoveFavResp(newQuestion,responses)
{

 

    return function(event)
    {
      
      
        responses.favResponse =!responses.favResponse;
       // console.log(newQuestion);
       // saveResponse(newQuestion,responses);
        
        if(responses.favResponse)
        {
            event.target.innerHTML="Remove Fav";
        }
        else
        {
            event.target.innerHTML="Add To Fav";
        }
         


    }


}