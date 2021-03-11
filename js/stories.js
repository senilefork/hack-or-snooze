"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <span class="star"><i class="fas fa-star"></i></span>
        <a href="${story.url}" target="a_blank" class="story-link">
        ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

function generateOwnStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

 // const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <span class="trash"><i class="fa fa-trash" aria-hidden="true"></i></span>
        <span class="star"><i class="fas fa-star"></i></span>
        <a href="${story.url}" target="a_blank" class="story-link">
        ${story.title}
        </a>
      
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}
 /* <small class="story-hostname">(${hostName})</small>*/

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();
  $ownStoriesList.hide();
  $favoriteStories.hide();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

function addStoryClick(){
  $allStoriesList.hide();
  $ownStoriesList.hide();
  $addStoryForm.show();
}

$subStory.on("click", addStoryClick)


async function subStory(evt) {
  evt.preventDefault();
  const title = $("#title").val();
  const url = $("#url").val();
  const author = $("#author").val();
  const username = currentUser.username
  const storyData = {title, url, author, username };

  const story = await storyList.addStory(currentUser, storyData);
  currentUser.ownStories.push(story)
  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story);
  $allStoriesList.show();
  $addStoryForm.trigger("reset")
}

$addStoryForm.on("submit",subStory);

function ownStories(){
  $ownStoriesList.empty();
  $allStoriesList.hide();
  $favoriteStories.hide();
  $subStoryForm.hide();
  for (let story of currentUser.ownStories) {
    const $story = generateOwnStoryMarkup(story);
    $ownStoriesList.append($story);
  }
  $ownStoriesList.show();
}

$ownStories.on("click", ownStories);




async function addFavStory(evt){
  const $target = $(evt.target);
  const $closestLi = $target.closest("li");
  const storyId = $closestLi.attr("id");
  //const checkBox = document.getElementById(`"${storyId}"`);
  //console.log(checkBox)
  //console.log(storyId) 
  const story = await StoryList.getFavStory(storyId);
  await currentUser.addFavStoryToUser(storyId)
  currentUser.favorites.push(story)
  console.log(currentUser.favorites)
}

$storiesLists.on("click", ".star", addFavStory);

function favoritesNavClick(){
  $allStoriesList.hide();
  $subStoryForm.hide();
  $ownStoriesList.hide();
  $favoriteStories.empty();
  for(let story of currentUser.favorites){
    console.log(story)
    const $story = generateStoryMarkup(story);
    $favoriteStories.append($story);
  }
  $favoriteStories.show();
}

$favorites.on("click", favoritesNavClick);
        

async function deleteClick(evt){
  $ownStoriesList.empty();
  const $target = $(evt.target);
  const $closestLi = $target.closest("li");
  const storyId = $closestLi.attr("id");
  console.log(storyId)
  await StoryList.deleteStory(currentUser, storyId);

  for(let i = 0; i < currentUser.ownStories.length; i++){
   // console.log(currentUser.ownStories[i].storyId)
    if(storyId === currentUser.ownStories[i].storyId){
      currentUser.ownStories.splice(i,1)
    }
    //console.log(currentUser.ownStories)
  }

  for (let story of currentUser.ownStories) {
    const $story = generateOwnStoryMarkup(story);
    $ownStoriesList.append($story);
  }
  $ownStoriesList.show();
}
$storiesLists.on("click", ".trash", deleteClick);
        
