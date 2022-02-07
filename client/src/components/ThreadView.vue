<template>
	<div>
		<div class="common__area" v-if="messages.length">
        <div class="common__tab__area diff emails--in--this--conversation" >
            <div class="tab-content" id="nav-tabContent" v-if="messageDetails && !loading">       
				<div class="tab-pane fade active show" role="tabpanel" aria-labelledby="nav-contact-tab2"> 
					<div class="common__mail__wrapper">
						<div class="mail__details__blk position-relative">
							<div class="mail__details__left">
								<p>
									<b> TO:</b> {{messageDetails?.payload.headers.find(header => header.name.toLowerCase() == "to")?.value ?? ''}}
								</p>

								<p>
									<b>From: </b>
									{{messageDetails?.payload.headers.find(header => header.name.toLowerCase() == "from")?.value}}
								</p>

								<p><b> Copy also sent to:</b> </p>
								<p>
									<b>Subject:</b> 
									{{messageDetails?.payload.headers.find(header => header.name.toLowerCase() == "subject")?.value}}
								</p>
							</div>

							<div class="mail__details__right">
								<div class="mail__time">
									<p>{{moment(+messageDetails?.internalDate).format('DD/MM/YY HH:ss a')}}</p>
								</div>
							</div>

							<div class="mail__close" @click="closeMail" title="Close Mail">
								<i class="far fa-times"></i>
							</div>

						</div>

						<div class="thread__area">
							<p>(There are {{messages.length - 1}} other emails in this conversation)</p>
							<a href="javascript:void(0)" @click="hideRelatedEmails" class="bg--orange">Hide related emails</a>
						</div>

						<!--Mail body -->
						<div v-html="messageDetails.decoded_parts ? messageDetails.decoded_parts[0] : messageDetails.snippet" class="common__mail__body mail--content diff">   
						</div>

						<div class="common__mail__bottom d-flex">
							<div class="mail__bottom__btns">
								<button type="button" class="common__btn">Send again with message</button>
								<button type="button" class="common__btn">Send to another</button>
								<button type="button" class="common__btn">Print</button>
								<button type="button" class="common__btn trash--btn">
									<span><img src="assets/img/trash-1.png" alt=""></span>
									<b>Put in TRASH</b>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			
			<!--Loader while message details are being fetched -->
			<div v-if="loading" class="tab-content" id="nav-tabContent" style="width:700px">
				<div class="tab-pane fade active show" id="nav-home-1" role="tabpanel"
					aria-labelledby="nav-home-tab">
					<div class="loader"></div>
				</div>
			</div>

			<nav>
				<div class="nav__title bg--orange">
					<h5>EMAILS IN THIS CONVERSATION</h5>
				</div>

				<div class="nav nav-tabs" id="nav-tab" role="tablist">
					<button v-for="(message, index) in messages" :key="index" class="nav-link" :id="`nav-contact-tab-${index}`" data-bs-toggle="tab" data-bs-target="#nav-contact2" type="button" role="tab" aria-controls="nav-contact2" aria-selected="false" @click="getMessageDetails(message.id)"
					>
						<div class="nav__btn__content">
							<div class="nav__btn__top">
								<p>From: {{message.payload.headers.find(header => header.name.toLowerCase() == "from")?.value}}</p>

								<p class="date">{{moment(+message.internalDate)?.format('DD/MM/YY')}}</p>
							</div>

							<p>{{truncatedSubject(message.payload.headers.find(header => header.name.toLowerCase() == "subject")?.value)}}</p>
						</div>
					</button>
				</div>
			</nav>

		</div>																																												
	</div>

	<div class="common__area" v-if="loading && !messages.length">
		<div class="loader"></div>
	</div>
	</div>
	
</template>

<script>
import * as Sentry from "@sentry/vue";
import axios from 'axios';
import moment from 'moment';

	export default {
		data(){
			return {
				moment: moment,
				messages: [],
				messageDetails: null,
				loading: false
			}
		},

		mounted(){
			const {id} = this.$route.params;
			this.getThreadMessages(id);
		},


		methods:{
			getThreadMessages(thread_id){
				this.loading = true;
				axios.get(`/api/users/me/thread/${thread_id}`)
					.then(res => {
						if(!res.data.error){
							this.messages = res.data.data.messages;
						}
						this.loading = false;
					})
					.catch(err => {
						Sentry.captureException(err);
					})
			},

			getMessageDetails(messageId){
				this.loading = true;
				axios.get(`/api/users/me/message/${messageId}`)
					.then(payload => {
						if(!payload.data.error){
							this.messageDetails = payload.data.data;
							if(this.messageDetails.decoded_attachments?.length){
								let parsedAttachment = this.$filters.parseAttachments(this.messageDetails.decoded_attachments);
								if(this.messageDetails.decoded_parts){
									this.messageDetails.decoded_parts[0] += parsedAttachment;
								}
								else{
									this.messageDetails.snippet += parsedAttachment;
								}
							}
						}
						this.loading = false;
					})
					.catch(err => {
						Sentry.captureException(err);
					})
			},

			parseAttachments(decodedAttachments){
				let attachmentHTML = "";
				for(let attachment of decodedAttachments){
					if (attachment.attachment_data.data.length > 0)
					{
						let dataBase64Rep = attachment.attachment_data.data.replace(/-/g, '+').replace(/_/g, '/');
						let urlBlob = this.b64toBlob(dataBase64Rep, attachment.mimeType, attachment.attachment_data.size);

						attachmentHTML += `<a href="`+urlBlob+`" download="`+attachment.filename+`"> <div style="margin-top: 0.5rem; padding: 0.3rem; border: 1px solid #ccc; cursor: pointer;">
						`+attachment.filename+`
						</div></a>`
						//URL.revokeObjectURL(urlBlob)
					}
				}
				
				return attachmentHTML;
			},

			b64toBlob (b64Data, contentType, sliceSize) {
				contentType = contentType || ''
				sliceSize = sliceSize || 512

				var byteCharacters = atob(b64Data)
				var byteArrays = []

				for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
					var slice = byteCharacters.slice(offset, offset + sliceSize)

					var byteNumbers = new Array(slice.length)
					for (var i = 0; i < slice.length; i++) {
						byteNumbers[i] = slice.charCodeAt(i)
					}

					var byteArray = new Uint8Array(byteNumbers)

					byteArrays.push(byteArray)

				}
				var blob = new Blob(byteArrays, {type: contentType})
				let urlBlob = URL.createObjectURL(blob)
				return urlBlob;
			},	

			truncatedSubject(subject){
				if(typeof subject !== "string") return '';

				const maxLength = 20;
				//truncate subject if it exceeds the given maxLength
				if(subject.length > maxLength){
					return subject.slice(0, maxLength) + " ...";
				}
				return subject;
			},

			hideRelatedEmails(){
				const {label} = this.$route.params;
				this.$router.push(`/${label}`);
			},

			closeMail(){
				this.messageDetails = null;
				let activeElement = document.querySelector('.nav-link.active');
				activeElement.classList.remove('active');
			}
		}
	}
</script>

<style scoped>
	.common__tab__area{
		justify-content: flex-end;
	}
	.common__tab__area.diff #nav-tabContent{
		padding-left: 0;
	}
</style>