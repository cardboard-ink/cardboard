<script>
  export let data

</script>
<h1>
  Are you really who you say you are?
</h1>
<p>
  We need to confirm that you are really the person you claim to issue the cookie which will be used for verification later.
  However, we require you to do the following steps to confirm your identity:
</p>
<ol class="list-decimal">
  <li>
    Go to <a href={`https://www.guilded.gg/profile/${data.userId}`} target="_blank">Your Profile</a>
  </li>
  <li>
    Make sure you are signed in to the account you chose on the previous page and click on <strong>"Write a post"</strong>
  </li>
  <li>
    Make the title of the post <code>{data.userAuthToken}</code>. You can fill the body with anything! (Flex being a cool cardboard user!) 
  </li>
  <li>
    Click <strong>"Post"</strong> and then press <strong>"Check"</strong> over here.
  </li>
</ol>
<form action="?/check" method="post">
  <button class="btn variant-ghost-primary rounded-md" type="submit">Check</button>
</form>

