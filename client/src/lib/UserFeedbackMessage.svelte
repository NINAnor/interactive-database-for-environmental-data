<script>
  import { userFeedbackStore } from '../stores/userFeedbackStore.js'
  import Modal from './Modal.svelte'
  import { SVG_PATHS } from '../constants/svgPaths'

  $: userFeedback = $userFeedbackStore

  /**
   * Handles the close event of the modal
   * @returns {void}
   */
  function handleClose () {
    userFeedbackStore.update((feedback) => {
      feedback.pop()
      return feedback
    })
  }
</script>

<!-- Shows each user feedback messages as modals, overlaying each other -->
{#each userFeedback as feedback}
  {#if feedback.message}
    <Modal on:close={handleClose} large={feedback.extra}>
      <img
        src={feedback.type ? SVG_PATHS[feedback.type] : SVG_PATHS.CLOSE}
        alt={feedback.type}
        class='icon'
      />
      <h3>{feedback.message}</h3>
      {#if feedback.extra}
        <ul style="max-height: 70vh; overflow-y: auto; width: 100%">
        {#each feedback.extra.validation as err}
          <li>
            <div><b>Sheet:</b> {feedback.extra.sheet}</div>
            <div><b>Row:</b> 
              <ul>
                {#each Object.entries(feedback.extra.row) as entry}
                  <li><b>{entry[0]}:</b> {entry[1]}</li>
                {/each}
              </ul>
            </div>
            <div><b>Error type:</b> {err.type}</div>
            <div><b>Message:</b> {err.msg}</div>
          </li>
        {/each}
        </ul>
      {/if}
    </Modal>
  {/if}
{/each}

<style>
  h3 {
    margin: 20px 0;
    text-align: center;
    color: #333;
    font-size: 1.5rem;
  }

  .icon {
    width: 80px;
    height: 80px;
  }
</style>
