<template>
    <div>
        <!--------- Main area start --------->
        <div class="main__area">
            <div class="container-fluid">
                <router-view />
            </div>
        </div>
        <!--------- Main area end --------->
    </div>
</template>

<script>
import Inbox from "./Inbox.vue";
export default {
    data(){
        return{

        }
    }
}
</script>