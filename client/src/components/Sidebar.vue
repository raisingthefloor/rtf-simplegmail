<template>
    <div>
        <!--------- Menu Bar area start --------->
    <div class="menu__bar">
        <div class="write__email__btn">
            <router-link to="/mail-compose" class="common__btn">
                <span><img src="assets/img/pen.png" alt=""></span>Write <br> New email
            </router-link>
        </div>
        <div class="main__menu__wrapper">
            <div class="main_menu">
                <ul>
                    <li>
                        <router-link to="/drafts">
                            <span><img src="assets/img/pencil.png" alt=""></span>DRAFTS Not Sent
                        </router-link>
                    </li>
                    <li>
                        <router-link to="/inbox" :class="$route.name == 'Inbox' ? 'active' : ''">
                            <span><img src="assets/img/inbox.png" alt=""></span>Inbox 
                            <div class="new__mail new__notifications">2 new</div>
                        </router-link>
                    </li>
                    <li>
                        <a href="#">
                            <div class="ml-2"></div> ? Junk mail ?
                        </a>
                    </li>
                    <li>
                        <router-link to="/sent">
                            <span><img src="assets/img/folder.png" alt=""></span>Email I SENT
                        </router-link>
                    </li>
                    <li><a><span><img src="assets/img/folder.png" alt=""></span>SAVED email</a>
                    </li>
                    <li>
                        <router-link to="/trash">
                            <span><img src="assets/img/trash-1.png" alt=""></span> email in TRASH
                        </router-link>
                    </li>
                </ul>
            </div>
        </div>
        <div class="add__new__folder text-center">
            <a href="#" class="common__btn" data-bs-toggle="modal" data-bs-target="#exampleModal">Add New Folder</a>
        </div>
        <div class="menu__bottom">
            <a href=""><i class="fas fa-user"></i></a>
            <a href="" class="active"><img src="assets/img/google-hangouts-logo.png" alt=""></a>
            <a href=""><i class="fas fa-phone fa-rotate-90"></i></a>
        </div>
    </div>
    <!--------- Menu Bar area end --------->
    </div>
</template>

<script>
export default {
    data(){
        return{

        };
    },

    methods: {}
}
</script>