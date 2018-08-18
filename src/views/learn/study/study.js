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
            this.$router.push('/learn/learn')
        },
    },
    beforeCreate() {
        this.SDKRegister(this, () => {})
    },
}