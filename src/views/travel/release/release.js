import Vue from 'vue';


export default {
    data() {
        return {
            Url: 'http://192.168.1.105/',
            content: '',
            formFiles: {},
            noteimg: []
        }
    },
    watch: {},
    mounted: function() {

    },
    methods: {
        save() {
            // console.log('this.noteimg.length', this.noteimg.length)
            // console.log('this.content', this.content)
            if (this.noteimg.length === 0 && this.content === '') {
                this.$dialog.toast({ mes: '请填写游记再发布~' });
                return;
            } else {
                this.axios.post('/wechatauth/travel/note/publish', {
                    note_content: this.content,
                    note_images: this.noteimg
                }).then(res => {
                    console.log(res)
                    if (res.data.result) {
                        this.$dialog.toast({ mes: '发布成功！', timeout: 1500 });
                        this.$router.go(-1);
                    } else {
                        this.$dialog.toast({ mes: res.data.message, timeout: 3000 });
                    }
                })
            }
        },
        // 编辑游记商品图片     
        editImage(image, index) {
            let n = this.noteimg.indexOf(image)
            this.noteimg.splice(n, 1)
        },
        // 上传图片
        fileChange(e) {
            if (this.noteimg.length >= 3) {
                this.$dialog.toast({ mes: '最多上传3张图片！' });
                return;
            } else {
                this.$dialog.loading.open('图片上传中');
                var fileSize = 0;
                let _file = e.target.files[0];
                let _name = e.target.name;

                fileSize = _file.size
                if (fileSize > 8 * 1024 * 1024) {
                    this.$dialog.toast({ mes: '文件不能大于8M' });
                    e.target.value = '';
                    return
                }
                this.formFiles[_name] = _file;
                // 获取图片路径
                let formData = new FormData();
                formData.append('image', this.formFiles[_name]);
                this.axios.post('/wechatauth/image/upload', formData).then(res => {
                    this.noteimg.push(res.data.datas)
                        // this.noteimg.push(_name)
                    this.$dialog.loading.close();
                })
            }
        },
    },
    beforeCreate() {
        this.SDKRegister(this, () => {})
    },
}