const { createApp } = Vue;

// tentukan lokasi API REST End Point 
const apiUrl = 'http://localhost/Lab7Web/public';

createApp({
    data() {
        return {
            artikel: '',
            formData: {
                id: null,
                judul: '',
                isi: '',
                status: 0
            },
            showForm: false,
            formTitle: 'Tambah Data',
            formTitles: [{ text: 'Tambah Data' }],
            statusOptions: [
                { text: 'Draft', value: 0 },
                { text: 'Publish', value: 1 },
            ],
        };
    },
    mounted() {
        this.loadData();
    },
    methods: {
        loadData() {
            axios.get(apiUrl + '/post')
                .then(response => {
                    this.artikel = response.data.artikel;
                })
                .catch(error => console.log(error));
        },
        tambah() {
            this.showForm = true;
            this.formTitle = 'Tambah Data';
            this.formData = {
                id: null,
                judul: '',
                isi: '',
                status: 0,
                id_kategori: ''
            };
        },
        hapus(index, id) {
            if (confirm('Yakin menghapus data?')) {
                axios.delete(apiUrl + '/post/' + id)
                    .then(response => {
                        this.artikel.splice(index, 1);
                    })
                    .catch(error => console.log(error));
            }
        },
        edit(data) {
            this.showForm = true;
            this.formTitle = 'Ubah Data';
            this.formData = {
                id: data.id,
                judul: data.judul,
                isi: data.isi,
                status: data.status,
                id_kategori: data.id_kategori
            };
        },
        saveData() {
            const form = new FormData();
            form.append('judul', this.formData.judul);
            form.append('isi', this.formData.isi);
            form.append('status', this.formData.status);
            form.append('id_kategori', this.formData.id_kategori ?? '');

            if (this.formData.id) {
                // PUT pakai FormData: gunakan method override
                form.append('_method', 'PUT');
                axios.post(apiUrl + '/post/' + this.formData.id, form)
                    .then(response => {
                        this.loadData();
                    })
                    .catch(error => console.log(error));
            } else {
                // POST untuk tambah data
                axios.post(apiUrl + '/post', form)
                    .then(response => {
                        this.loadData();
                    })
                    .catch(error => console.log(error));
            }

            // reset form
            this.formData = {
                id: null,
                judul: '',
                isi: '',
                status: 0,
                id_kategori: ''
            };
            this.showForm = false;
        },

        statusText(status) {
            return status == 1 ? 'Publish' : 'Draft';
        }
    },
}).mount('#app');
