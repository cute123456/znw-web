import Vue from 'vue';


export default {
    data() {
        return {}
    },
    watch: {},
    mounted: function() {

    },
    methods: {
        toLearn() {
            this.$router.push('/travel/notes')
        },
        toSelect() {
            this.$router.push('/travel/selectcity')
        },
        toActivities() {
            this.$router.push('/travel/activities')
        },
        toActicle() {
            this.$router.push('/travel/travel')
        },
    },
    beforeCreate() {
        this.SDKRegister(this, () => {})
    },
}