import {
  UPLOAD_URL,
  UPLOAD_ENDPOINT
} from '../constants/endpoints.js'
import { addFeedbackToStore } from '../utils/addFeedbackToStore.js'
import { FEEDBACK_TYPES, FEEDBACK_CODES, FEEDBACK_MESSAGES } from '../constants/feedbackMessages'
import { authRefresh } from './auth.js'
import { reportError } from '../utils/report.js'

/**
 * Upload file to server
 * @param {File} file - The file to upload
 * @returns {Promise<boolean>} - A promise which resolves to if upload was successful or not
 */
export async function uploadFileToServer (file) {
  // Create a new FormData object and add file to it
  const formData = new FormData()
  formData.append('file', file)

  try {
    // Try to upload the file
    const response = await fetch(`${UPLOAD_URL}${UPLOAD_ENDPOINT}`, {
      method: 'POST',
      body: formData,
      credentials: 'same-origin'
    })

    // If response has status 401 not authorized
    if (response.status === 401) {
      // Refresh token and give feedback to user based on the result
      await authRefresh()

      return false
    }

    // Check if the response is ok
    if (!response.ok) {
      try {
        // not ok responses could contain valid JSON
        const result = await response.json();
        console.error(result);
        const { message } = result.error;
        if (result.error.validation) {
          addFeedbackToStore(FEEDBACK_TYPES.ERROR, FEEDBACK_CODES.UPLOAD_REJECTED, 'Validation Error', result.error)
        } else {
          addFeedbackToStore(FEEDBACK_TYPES.ERROR, FEEDBACK_CODES.UPLOAD_REJECTED, message);
        }
      } catch (e) {
        reportError(e)
        addFeedbackToStore(FEEDBACK_TYPES.ERROR, FEEDBACK_CODES.UPLOAD_REJECTED, FEEDBACK_MESSAGES.UPLOAD_REJECTED)
      }
      return false
    }

    // Retrieve the result from the response
    const result = await response.json()

    // Check if the upload was successful
    if (result.success) {
      addFeedbackToStore(FEEDBACK_TYPES.SUCCESS, FEEDBACK_CODES.UPLOAD_SUCCESS, FEEDBACK_MESSAGES.UPLOAD_SUCCESS)
      return true
    }
    addFeedbackToStore(FEEDBACK_TYPES.ERROR, FEEDBACK_CODES.UPLOAD_REJECTED, FEEDBACK_MESSAGES.UPLOAD_REJECTED)
    return false
  } catch (error) { // Catch any possible network or fetch errors
    reportError(error)
    addFeedbackToStore(FEEDBACK_TYPES.ERROR, FEEDBACK_CODES.UPLOAD_UNAVAILABLE, FEEDBACK_MESSAGES.UPLOAD_UNAVAILABLE)
    return false
  }
}
