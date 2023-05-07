//Program yıllık çalıştığı için bir sayaç gerekli
var ay_sayaci = 0
//Ayları seçebilmemiz için bir tarih daha oluşturuyoruz.
var tarih_secici = new Date()
//ay sayacı 12 ayı da ayarlamamızı sağlayacak
tarih_secici.setMonth(ay_sayaci)

$(function(){
    //Eğer kullanıcı bilgisi bulunmuyorsa kayıt sayfasına yönlendirir.
    if(!localStorage.getItem("kullanici-bilgileri"))
        document.location.href = "setup"
    //sistemin ana fonksiyonunu çağırır.
    main()

    //iki ok arasında yer alan ay ismini ayarlar
    $("#month").text(tarih_secici.toDateString().split(" ")[1])

    //Ay sayacında geriye gitmeyi sağlar
    $("#backMonth").on("click", function()
    {
        //önceki seneye geçmeyi engeller
        if(ay_sayaci > 0)
        {
            ay_sayaci -= 1
            tarih_secici.setMonth(ay_sayaci)
            /*
                Ay ismini almak için kullanılır. 
                Çünkü .getMonth() fonksiyonu ayı bize number yani sayısal değer olarak veriyor.
            */
            $("#month").text(tarih_secici.toDateString().split(" ")[1])
            //Tablonun ve içeriğinin oluşması için ana fonksiyon çağırıldı.
            main()
        }
    })
    //az önceki 'geriye sarma' fonksiyonundan tek farkı ayları ilerletir.
    $("#nextMonth").on("click", function()
    {
        if(ay_sayaci < 11)
        {
            ay_sayaci += 1
            tarih_secici.setMonth(ay_sayaci)
            $("#month").text(tarih_secici.toDateString().split(" ")[1])
            main()
        }
    })
})
        
function main()
{
    /*
        Aşağıdaki 8 satır butonların tıklanamaz hale gelmesini sağlar.
        Yani eğer Ocak ayında bulunursak geriye gitme butonu kapanacak.
        Eğer Aralık ayında bulunursak ileri gitme butonu kapanacak.
    */
    if(ay_sayaci == 0)
        $("#backMonth").attr("disabled",true)
    else
        $("#backMonth").attr("disabled",false)
    if(ay_sayaci == 11)
        $("#nextMonth").attr("disabled",true)
    else
        $("#nextMonth").attr("disabled",false)

    //Tabloda günlerin bulunacağı satırı ayarlar. td ise sol üstte boş kutucuk oluşturur.
    $("table").html('<tr id="ilk"><td></td></tr>')
    
    //Kullanıcı bilgilerine erişir.
    $(JSON.parse(localStorage.getItem("kullanici-bilgileri"))).each(function(l, e)
    {
        //1 ayda bulunabilecek maximum gün sayısı olan 31'gün kadar çalışır.

        for (let i = 1; i < 32; i++) 
        {
            /*
                ilgi alanlarını çeker ancak dizi olduğu için 1 eksiltir.
                döngüde 1'den başlattık çünkü günler 1'den başlıyor.
            */
            var ilgi_alani = e.ilgi_alanlari[i - 1]

            //İlgi alanı olmadığında undefined döndürerek sistemi bozmaması için if kullanılıyor.
            if(ilgi_alani)
                $("table").append(`<tr id='${ilgi_alani}'><td>${ilgi_alani}</td></tr>`) //ilgi alanları tabloya ekleniyor.
            
            //ayın uzunluğunu almamız gerekiyor. Çünkü günleri buna göre görüntüleyeceğiz.
            var ay_uzunlugu = Object.keys(e.olcum_tablosu[tarih_secici.toDateString().split(" ")[1]]).length + 1
        
            for(let i = 1; i < ay_uzunlugu; i++)
            {
                /*
                    eğer seçili ayın, seçili günü seçilen ilgi alanı değeri true yani 'tamamlandı' ise işaretli,
                    eğer false yani 'tamamlanmadı' ise işaretsiz bir checkbox oluşturacaktır.
                */
                if(e.olcum_tablosu[tarih_secici.toDateString().split(" ")[1]][i][ilgi_alani])
                    $(`#${ilgi_alani}`).append(`<td><input type="checkbox" checked value='${i} ${ilgi_alani}'></td>`)
                else
                    $(`#${ilgi_alani}`).append(`<td><input type="checkbox" value='${i} ${ilgi_alani}'></td>`)
                /*
                    Yukarıdaki value değerleri checkbox'ın işaretlenme olayında kullanılmak üzere oluşturulmuşlardır.
                    Bu değerler tabloda bulundukları konumu bulmamızı sağlayacak.
                    Yani '16, temizlik-yapmak' gibi bir değerde '16' gün sayısı, 'temizlik-yapmak' alışkanlık olduğundan
                    seçilen ayın 16.gününün temizlik-yapmak isimli özelliğini update edebilecektir. 
                */
            }
        }
        //Tablodaki gün rakamlarını oluşturur.  
        for(var i = 1; i < ay_uzunlugu; i++)
            $("#ilk").append(`<td>${i}</td>`)
    })
    
    //Aşağıda bulunan grafik güncellenir.
    grafigi_ayarla()
    
    //checkbox tıklandığında olacak olaylar.
    $("input").on("click", function()
    {
        //Eğer işaretlendi ise
        if(this.checked)
        {
            //2 value değerini ayrı ayrı almamızı sağlıyor
            var giris = this.value.split(" ")

            $(JSON.parse(localStorage.getItem("kullanici-bilgileri"))).each(function(l, e)
            {
                /*
                    Kullanıcı bilgileri içerisinde seçili ay, gün ve alışkanlığı bulur.
                    Ardından checkbox işaretli olduğu için değerini 'true' yani tamamlandı olarak ayarlar.
                */
                e.olcum_tablosu[$("#month").text()][giris[0]][giris[1]] = true    
                //Localstorage'ı günceller.
                localStorage.setItem("kullanici-bilgileri", JSON.stringify(this))
            })
        }
        else
        {
            //Yukarıdaki işlemin aksine false yani 'tamamlanmadı' olarak ayarlanır.
            var giris = this.value.split(" ")
            $(JSON.parse(localStorage.getItem("kullanici-bilgileri"))).each(function(l, e)
            {
                e.olcum_tablosu[$("#month").text()][giris[0]][giris[1]] = false    
                localStorage.setItem("kullanici-bilgileri", JSON.stringify(this))
            })
        }
        
        grafigi_ayarla()
    })

    //kullanıcı bilgisini silerek bizi kurulum sayfasına yönlendirir.
    $("#reset").on("click", function()
    {
        localStorage.removeItem("kullanici-bilgileri")
        document.location.reload()
    })
}

function grafigi_ayarla()
{
    //chart.js kütüphanesi kullanılmaktadır//

    //canvas oluşturulur.
    $("#canvas-parent").html('<canvas id="myChart" width="500" height="100"></canvas>')
    //her ilgi alanının sıklığını tutacak bir obje oluşturulur
    var sikliklar = {}
    $(JSON.parse(localStorage.getItem("kullanici-bilgileri"))).each(function(l, e)
    {
        //maximum gün sayısında çalıştırılır.
        for (let i = 1; i < 32; i++) 
        {
            //dizi olduğu için yine 1 çıkartıyoruz.
            var ilgi_alani = e.ilgi_alanlari[i - 1]
            //ay uzunluğunu değişkene aldık.
            var ay_uzunlugu = Object.keys(e.olcum_tablosu[tarih_secici.toDateString().split(" ")[1]]).length + 1
            
            //ilgi alanının undefined olmasını engelliyoruz ve var olan ilgi alanlarına sayac oluşturuyoruz.
            if(ilgi_alani)
                sikliklar[ilgi_alani] = 0
            
            for(let i = 1; i < ay_uzunlugu; i++)
                //Burda da eğer ilgi alanı tamamlandı olarak işaretlendi ise ilgi alanının sayacı artacaktır. 
                if(e.olcum_tablosu[tarih_secici.toDateString().split(" ")[1]][i][ilgi_alani])
                    Math.floor(sikliklar[ilgi_alani] += 1) 
        }
    })
    

    //ilk olarak canvas alınır ve ayarlanır.
    var canvas = document.getElementById('myChart')
    var ctx = canvas.getContext('2d');
    
    /*
        Chart.js ile grafiğin türü, içeriği, ismi, arkaplan rengi, kenarlık kalınlığı gibi özellikler ayarlanır.
        'options, scales, y, max' ifadesi grafiğin en fazla kaç olabileceğini belirtir.
        1 ayda maximum olabilecek gün sayısı yani '31' gün olarak ayarlamaktayız. 
    */
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: JSON.parse(localStorage.getItem("kullanici-bilgileri"))["ilgi_alanlari"],
            datasets: [{
                label: 'Alışkanlık Sıklıkları',
                data: sikliklar,
                backgroundColor: "purple",
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    max: 31
                }
            }
        }
    });
}