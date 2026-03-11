$(document).ready(function () {
  // --- 1. CONFIGURATION ---
  const audioMap = {
    "#msg1": "msg1",
    "#msg2": "msg2",
    "#msg3": "msg3",
    "#msg6": "msg6",
    "#msg7": "msg7",
    "#msg10": "msg10",
    "#msg13": "y_msg7",
    "#msg14": "y_msg8",
    "#msg15": "y_msg9",
    "#msg18": "sorry",
  };
  let audioEnabled = false;
  const audioPlayer = new Audio();
  // NEW: Set the playback speed here. 1.0 is normal, 1.2 is 20% faster, 1.5 is 50% faster.
    const playbackSpeed = 1.2;

  // --- 2. HELPER FUNCTIONS ---
  function playAudio(filename) {
    if (!audioEnabled) {
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      audioPlayer.src = `audio/${filename}.mp3`;
      
      // NEW: This line sets the speed of the audio player.
      audioPlayer.playbackRate = playbackSpeed;
      
      audioPlayer.onended = resolve;
      audioPlayer.onerror = () => {
        console.error(`Error with audio file: ${filename}.mp3`);
        resolve();
      };
      audioPlayer.play().catch((error) => {
        console.error("Audio play error:", error);
        resolve();
      });
    });
  }

  async function showAndPlayMessage(selector) {
    $(selector).removeClass("hidden");
    scrollToBottom();
    const audioFile = audioMap[selector];
    if (audioFile) {
      await playAudio(audioFile);
    } else {
      await new Promise((res) => setTimeout(res, 1000));
    }
  }

  // NEW: This function plays a sequence of audio files in the background
  // without making the main script wait for it to finish.
  async function playAudioSequenceInBackground(audioFiles) {
    if (!audioEnabled) return;

    for (const audioFile of audioFiles) {
      // We await each audio file here, inside this function...
      await playAudio(audioFile);
    }
  }

  function scrollToBottom() {
    $("html, body").animate({ scrollTop: $(document).height() }, "fast");
  }

  // --- 3. MAIN CHAT FLOW LOGIC ---
  async function startSilentIntro() {
    await new Promise((res) => setTimeout(res, 1000));
    $("#initTyping").remove();
    $("#msg1").removeClass("hidden");
    scrollToBottom();
    await new Promise((res) => setTimeout(res, 1200));
    $("#msg2").removeClass("hidden");
    scrollToBottom();
    await new Promise((res) => setTimeout(res, 1800));
    $("#msg3").removeClass("hidden");
    scrollToBottom();
    await new Promise((res) => setTimeout(res, 500));
    $("#msg4").removeClass("hidden");
    scrollToBottom();
  }

  // --- 4. EVENT HANDLERS ---
  $("button.chat-button").on("click", async function () {
    if (!audioEnabled) {
      audioEnabled = true;
      console.log("Audio has been enabled by user interaction.");
    }

    const button = $(this);
    button.prop("disabled", true);
    const currentStep = button.data("form-step");
    const buttonValue = button.data("form-value");

    if (currentStep === 1) {
      $("#msg4").addClass("hidden");
      $("#userBlock1").removeClass("hidden");
      scrollToBottom();
      await new Promise((res) => setTimeout(res, 500));
      $("#agentBlock2").removeClass("hidden");
      await showAndPlayMessage("#msg6");
      await showAndPlayMessage("#msg7");
      $("#msg8a").removeClass("hidden");
      scrollToBottom();
    } else if (currentStep === 2) {
      $("#msg8a").addClass("hidden");
      $("#userBlock2").removeClass("hidden");
      if (buttonValue.includes("54")) $("#msg9-54to75").removeClass("hidden");
      else $("#msg9-76andOlder").removeClass("hidden");
      scrollToBottom();
      await new Promise((res) => setTimeout(res, 500));
      $("#agentBlock3").removeClass("hidden");
      await showAndPlayMessage("#msg10");
      $("#msg11").removeClass("hidden");
      scrollToBottom();
    } else if (currentStep === 3) {
      $("#msg11").addClass("hidden");
      $("#userBlock3").removeClass("hidden");
      if (buttonValue === "Yes") {
        $("#msg12Yes").removeClass("hidden");
        scrollToBottom();
        await new Promise((res) => setTimeout(res, 500));
        $("#agentBlock4").removeClass("hidden");

        // --- NEW LOGIC STARTS HERE ---

        // 1. Start the audio sequence in the background.
        // The script does NOT wait for this to finish.
        const qualificationAudio = [
          audioMap["#msg13"],
          audioMap["#msg14"],
          audioMap["#msg15"],
        ];
        playAudioSequenceInBackground(qualificationAudio);

        // 2. Immediately start showing the visual elements with very short delays.
        await new Promise((res) => setTimeout(res, 250));
        $("#msg13").removeClass("hidden");
        scrollToBottom();

        await new Promise((res) => setTimeout(res, 500));
        $("#msg14").removeClass("hidden");
        scrollToBottom();

        await new Promise((res) => setTimeout(res, 750));
        $("#msg15").removeClass("hidden");
        scrollToBottom();

        await new Promise((res) => setTimeout(res, 1000));
        $("#msg17").removeClass("hidden");
        scrollToBottom();
      } else {
        // This is the "No" condition
        $("#msg12No").removeClass("hidden");
        scrollToBottom();
        await new Promise((res) => setTimeout(res, 500));
        $("#agentBlock4").removeClass("hidden");
        // The disqualification message can still wait for audio since it's only one message.
        await showAndPlayMessage("#msg18");
        $("#disconnected").removeClass("hidden");
        scrollToBottom();
      }
    }

    if (!button.hasClass("funnel-complete-btn")) {
      button.prop("disabled", false);
    }
  });

  // --- 5. INITIALIZE ---
  const today = new Date();
  const formattedDate = `${today.toLocaleDateString("en-US", {
    month: "long",
  })} ${today.getDate()}, ${today.getFullYear()}`;
  $("#currentDate").text(formattedDate);
  startSilentIntro();
});
