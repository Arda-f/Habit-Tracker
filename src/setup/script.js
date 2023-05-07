//Form submit olayı gerçekleştiğinde sayfanın yenilenmesini önler
var form = document.getElementById("myForm");
function submitForm(event){
    event.preventDefault();
}
form.onsubmit = submitForm
//Ekle butonuna basıldığında olacaklar
$("#add").on("click", function(){
    //Kullanıcının kayıt olduğu tarihi almak için kullanılır
    var created = new Date()
    //Kullanıcının tüm bilgilerini içeren objeyi oluşturur.
    var kisi = {
        ad: $("#ad").val(),
        soyad: $("#soyad").val(),
        yas: $("#yas").val(),
        ilgi_alanlari: $("textarea").val().trim().replaceAll(" ", "-").split("\n"),
        ilk_kurulum: true,
        olcum_tablosu: {},
        createdAt: created.getDay() + "/" + created.getMonth() + "/" + created.getFullYear()
    }
    //12 Ay oluşturulur.
    for(let i = 1; i < 13; i++)
    {
        /*
            Kullanıcının ölçüm tablosunu oluşturmak için tarih alınır.
            uygulama şuan içerisinde bulunan yılın ilk gününe ayarlanır.
            Ayrıca ayın kaç gün çektiğini de hesaplar ve gün sayılarını buna göre oluşturur.
        */
        var date = new Date(new Date().getFullYear(), i, 0)
        /*
            Daha sonra tarihi boşluklardan keser, 
            ayın bulunduğu index'i yani [1]'i alı ve ayrı bir değişkene aktarır.
        */
        var month = date.toDateString().split(" ")[1]
        
        //Aylar içerisinde günler olacağı için obje olarak tanımlanır.
        kisi["olcum_tablosu"][month] = {}
        for(let j = 1; j < (date.getDate() + 1); j++)
        {
            //j gün sayısını temsil eder ve içerisinde alışkanlıklar olacağı için obje olarak tanımlanır
            kisi["olcum_tablosu"][month][j] = {}
            //Alışkanlıklar bir döngü ile çekilir ve gün içerisine eklenir.
            
            for(const ilgi_alani of $("textarea").val().trim().split((" ", "\n")))
            {
                //Her bir ilgi alanı varsayılan olarak false yani "yapılmadı" olarak ayarlanır.
                kisi["olcum_tablosu"][month][j][ilgi_alani] = false
            }
        }
        //Ayı arttırarak her ay için bu işlemin uygulanmasını sağlar
        date.setMonth(i)
    } 
    //bilgileri kaydeder ve bizi ana ekrana yönlendirir.
    localStorage.setItem("kullanici-bilgileri", JSON.stringify(kisi))
    document.location.href = ".."
})
        