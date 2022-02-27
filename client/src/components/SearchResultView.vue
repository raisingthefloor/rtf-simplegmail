<!--
Copyright 2020 Raising the Floor - International

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt

The R&D leading to these results received funding from the:
* Rehabilitation Services Administration, US Dept. of Education under
grant H421A150006 (APCP)
* National Institute on Disability, Independent Living, and
Rehabilitation Research (NIDILRR)
* Administration for Independent Living & Dept. of Education under grants
H133E080022 (RERC-IT) and H133E130028/90RE5003-01-00 (UIITA-RERC)
* European Union's Seventh Framework Programme (FP7/2007-2013) grant
agreement nos. 289016 (Cloud4all) and 610510 (Prosperity4All)
* William and Flora Hewlett Foundation
* Ontario Ministry of Research and Innovation
* Canadian Foundation for Innovation
* Adobe Foundation
* Consumer Electronics Association Foundation
-->

<template>
  <!--New Threaded UI-->
  <div
    :class="[
      'common__area',
      !messageDetails && !showThreadUI ? 'd-flex justify-content-between' : '',
    ]"
  >
    <div
      :class="[
        'common__tab__area',
        'diff',
        showThreadUI ? 'emails--in--this--conversation' : '',
      ]"
      v-if="threads.length"
    >
      <nav v-show="!showThreadUI">
        <div class="nav__title">
          <h5>email in <b>Search</b></h5>
        </div>

        <div class="nav nav-tabs" id="nav-tab" role="tablist">
          <button
            v-for="(thread, index) in threads"
            :key="index"
            @click="
              getMessageDetails(thread.messages[thread.messages.length - 1].id)
            "
            :class="[
              'nav-link',
              messageDetails?.threadId === thread.id ? 'active' : '',
            ]"
            :id="`nav-home-tab-${index}`"
            data-bs-toggle="tab"
            :data-bs-target="'#nav-home-' + index"
            type="button"
            role="tab"
            aria-controls="nav-home"
            :aria-selected="index == 0 ? 'true' : 'false'"
            :ref="`inbox_msg_${index}`"
          >
            <div class="nav__btn__content" v-if="thread.messages.length">
              <div class="nav__btn__top__grid">
                <p>
                  From:
                  {{
                    $filters.strip_html(
                      thread.messages[
                        thread.messages.length - 1
                      ].payload.headers.find(
                        (header) => header.name.toLowerCase() == "from"
                      )?.value
                    )
                  }}
                </p>

                <p>
                  <b
                    v-if="thread.messages.length > 1"
                    :title="`${thread.messages.length} messages in this conversation`"
                  >
                    ({{ thread.messages.length }})
                  </b>
                </p>

                <p class="date">
                  {{
                    moment(
                      thread.messages[
                        thread.messages.length - 1
                      ].payload.headers.find(
                        (header) => header.name.toLowerCase() == "date"
                      )?.value
                    )?.format("DD/MM/YY")
                  }}
                </p>
              </div>
              <div class="nav__btn__top">
                <p>
                  RE:
                  {{
                    $filters.truncatedSubject(
                      thread.messages[
                        thread.messages.length - 1
                      ].payload.headers.find(
                        (header) => header.name.toLowerCase() == "subject"
                      )?.value,
                      20
                    )
                  }}
                </p>
                <p
                  v-if="
                    thread.messages[
                      thread.messages.length - 1
                    ].labelIds.includes('UNREAD')
                  "
                >
                  <span class="new__message">NEW</span>
                </p>
              </div>
            </div>
          </button>
          <div
            v-if="nextPageToken"
            style="padding: 4px 8px; text-align: right; width: 100%"
          >
            <a @click="getThreads" href="javascript:void(0)">More</a>
          </div>
        </div>
      </nav>

      <div
        class="tab-content"
        id="nav-tabContent"
        v-if="messageDetails && !loading"
      >
        <div
          class="tab-pane fade show active"
          id="nav-home"
          role="tabpanel"
          aria-labelledby="nav-home-tab"
        >
          <div class="common__mail__wrapper">
            <div class="mail__details__blk position-relative">
              <div class="mail__details__left">
                <p>
                  <b> TO:</b>
                  {{
                    messageDetails.payload.headers.find(
                      (header) => header.name.toLowerCase() == "to"
                    )?.value ?? ""
                  }}
                </p>
                <p>
                  <b>From: </b>
                  {{
                    messageDetails.payload.headers.find(
                      (header) => header.name.toLowerCase() == "from"
                    )?.value
                  }}
                </p>
                <p><b> Copy also sent to:</b></p>
                <p>
                  <b>Subject:</b>
                  {{
                    messageDetails.payload.headers.find(
                      (header) => header.name.toLowerCase() == "subject"
                    )?.value
                  }}
                </p>
              </div>
              <div class="mail__details__right">
                <div class="mail__time">
                  <p>
                    {{
                      moment(+messageDetails?.internalDate).format(
                        "DD/MM/YY HH:ss a"
                      )
                    }}
                  </p>
                </div>
              </div>
              <div @click="closeMail" title="Close Mail" class="mail__close">
                <i class="far fa-times"></i>
              </div>
            </div>
            <div class="thread__area" v-if="hasMoreThanOneMessages">
              <p>
                (There are {{ remainingMsgCount }} other emails in this
                conversation)
              </p>
              <a
                v-if="showThreadUI"
                href="javascript:void(0)"
                @click="hideRelatedEmails"
                class="bg--orange"
                >Hide related emails</a
              >
              <a v-else href="javascript:void(0)" @click="dispThreadView"
                >Show related emails</a
              >
            </div>

            <div class="common__mail__body mail--content diff">
              <div
                v-html="
                  messageDetails.decoded_parts
                    ? messageDetails.decoded_parts[0]
                    : messageDetails.snippet
                "
              ></div>
            </div>

            <div class="common__mail__bottom d-flex">
              <div class="mail__bottom__btns">
                <button type="button" class="common__btn">
                  Send again with message
                </button>
                <button type="button" class="common__btn">
                  Send to another
                </button>
                <button type="button" class="common__btn">Print</button>
                <button type="button" class="common__btn trash--btn">
                  <span>
                    <img src="assets/img/trash-1.png" alt="" />
                  </span>
                  <b>Put in TRASH</b>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!--Loader while message details are being fetched -->
      <div
        v-if="loading"
        class="tab-content"
        id="nav-tabContent"
        style="width: 700px"
      >
        <div
          class="tab-pane fade active show"
          id="nav-home-1"
          role="tabpanel"
          aria-labelledby="nav-home-tab"
        >
          <div class="loader"></div>
        </div>
      </div>

      <!--Show this nav when showThreadUI is true-->
      <nav v-show="showThreadUI">
        <div class="nav__title bg--orange">
          <h5>EMAILS IN THIS CONVERSATION</h5>
        </div>

        <div
          class="nav nav-tabs"
          id="nav-tab"
          role="tablist"
          v-if="messages.length"
        >
          <button
            v-for="(message, index) in messages"
            :key="index"
            :class="[
              'nav-link',
              message.id === messageDetails?.id ? 'active' : '',
            ]"
            :id="`nav-contact-tab-${index}`"
            data-bs-toggle="tab"
            data-bs-target="#nav-contact2"
            type="button"
            role="tab"
            aria-controls="nav-contact2"
            aria-selected="false"
            @click="getMessageDetails(message.id)"
          >
            <div class="nav__btn__content">
              <div class="nav__btn__top">
                <p>
                  From:
                  {{
                    message.payload.headers.find(
                      (header) => header.name.toLowerCase() == "from"
                    )?.value
                  }}
                </p>

                <p class="date">
                  {{ moment(+message.internalDate)?.format("DD/MM/YY") }}
                </p>
              </div>

              <p>
                {{
                  $filters.truncatedSubject(
                    message.payload.headers.find(
                      (header) => header.name.toLowerCase() == "subject"
                    )?.value,
                    20
                  )
                }}
              </p>
            </div>
          </button>
        </div>
      </nav>
    </div>

    <div v-if="loading && !threads.length" class="loader"></div>
  </div>
</template>

<script>
import moment from "moment";
import axios from "axios";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      messages: [],
      messageDetails: null,
      threads: [],
      nextPageToken: null,
      moment: moment,
      loading: false,
      currentIndex: 0,
      showThreadUI: false,
      lastDisplayedMsgDetails: null,
    };
  },

  // lifecycle hooks
  created() {
    this.initSearchResultView();
  },

  // computed properties
  computed: {
    ...mapGetters(["selectedSearchResult", "lastActiveRoute", "advanceSearchResult"]),

    hasMoreThanOneMessages() {
      let thread = this.threads.find(
        (thread) => thread.id === this.messageDetails?.threadId
      );
      return thread?.messages?.length > 1;
    },

    remainingMsgCount() {
      let thread = this.threads.find(
        (thread) => thread.id === this.messageDetails?.threadId
      );
      return thread?.messages?.length - 1;
    },
  },

  // methods
  methods: {
    initSearchResultView() {
      if (this.selectedSearchResult.length) {
        // display result if state contains it
        this.threads = this.selectedSearchResult;
      } else if (this.advanceSearchResult.length) {
        this.threads = this.advanceSearchResult;
        console.log(this.thread, this.advanceSearchResult)
      } else {
        // redirect to last active route
        this.$router.replace({ path: this.lastActiveRoute });
      }
    },

    getMessageDetails(messageId) {
      this.loading = true;
      axios
        .get(`api/users/me/message/${messageId}`)
        .then((payload) => {
          if (!payload.data.error) {
            this.messageDetails = payload.data.data;
            if (this.messageDetails.decoded_attachments?.length) {
              let parsedAttachment = this.$filters.parseAttachments(
                this.messageDetails.decoded_attachments
              );
              if (this.messageDetails.decoded_parts) {
                this.messageDetails.decoded_parts[0] += parsedAttachment;
              } else {
                this.messageDetails.snippet += parsedAttachment;
              }
            }
          }
          this.loading = false;
        })
        .catch((err) => {
          console.log(err)
        });
    },

    closeMail() {
      this.messageDetails = null;
      let activeElement = document.querySelector(".nav-link.active");
      activeElement.classList.remove("active");
    },
  },
};
</script>

<style>
</style>