module.exports.commerce = 
{
    modulename:'commerce',
    //admin
    name:'🏷💰 ' + 'تجارت', 
    back:'🔙 بازگشت به تجارت',
    readSym: ['📪','📭'],

    f_peied     : '✅',
    f_notpaid  : '☑️',

    //factor types
    factorTypes : {
        post:'post'
    },

    btns: {
        settings : '⚙️' + ' - ' + 'تنظیمات',
        backsetting: '🔙 بازگشت به ' + '⚙️' + ' - ' + 'تنظیمات',
        couponGenerators        :'🏷 ' + 'بن ساز ها',
        couponGeneratorsBack    :'🔙 ' + 'بن ساز ها',
        addgenerator            :'➕ ' + 'افزودن بن ساز',
    },

    //user
    btns_user:{
        bagshop: '🧺 ' + 'ثبت  سفارش کالا 🛒',
        myProducts: '🛍 ' + 'خرید های من',
        factor: '📮 ' + 'فاکتورهای من',
    },

    query : {
        commerce : 'commerce',
        admin:'a',
        user : 'u',
        backtobag:'btb',
        submitbag: 'submitbag',
        usecoupon:'uc',
        coupon:'co',
        clearbag: 'clearbag',
        deletefactor: 'deletef',
        itemsdetail: 'itmdtl',
        close: 'close',
        getpaid: 'getpaid',
        addToBag:'addToBag',
        address:'address',
        phone:'phone',
        postalInfo:'postalInfo',
        fullname:'fullname',

        //generator
        generator:'gen',
        sessions:'sessions',
        createtime:'createtime',
        minimumP:'minimumP',
        maximumP:'maximumP',
        mode:'mode',
        discountmode:'discountmode',
        amount:'amount',
        percent:'percent',
        days:'days',
        hours:'hours',
        consumption:'consumption',
        consumptionway:'consumptionway',
        status:'status',
        delete:'delete',

        //settings
        settings    :'stings',
        activation  :'activate',
        category    :'catry',
        order       :'order',
    },

    mess : {
      editbag:'👇 ' + 'توسط کلید های زیر از خدمات ربات استفاده کنید.',
      notafactor:'همچین فاکتوری وجود ندارد لطفا از گزینه های زیر استفاده کنید.',
      alreadyAdded:'شما قبلا این محصول را به سبد خرید خود اضافه کرده اید.',
      getAddress:'•  لطفا آدرس پستی خود را به همراه کدپستی نوشته و ارسال نمایید \n •  توجه داشته باشید که نوشتن کد پستی برای سهولت ارسال میباشد و اجباری نمیباشد.',
      getPhone:'لطفا از طریق دکمه زیر اجازه دهید شماره موبایل شما برای ما ارسال شود. \n برای سهولت در امر پست و تحویل کالا دسترسی به شماره تماس شما الزامی است.',
      getfullname:'لطفا نام و نام خانوادگی خود را با زبان فارسی ارسال کنید.',
      notGenerator:'این بن دیگر موجود نمیباشد لطفا از گزینه های زیر استفاده کنید.',
      getnameGenerator:'لطفا یک نام برای "بن ساز" انتخاب کنید.',
    },

    //coupon
    discountmode: {
        amount      : 'amount',
        percent     : 'percent',
    },

    datas: {

        oneCoupons: {
            'name'  : 'حالت تک بن',
            'mess'  : 'اگر این حالت فعال باشد، از هر نوع بن "درصدی، نقدی" فقط یک بار صادر میشود و در صدور های بعد تا مادامی که بن مصرف نشده باشد، فقط به مدت زمان بن قبلی اضافه میشود.',
            'items' : [
                {'name': 'true', 'lable':'فعال'},
                {'name': 'false', 'lable':'غیر فعال'},
            ]
        },

        testpayment:{
            'name'  : 'پرداخت آزمایشی',
            'mess'  : 'لطفا نوع تعامل ربات با فروشگاه خود را مشخص کنید.',
            'items' : [
                {'name': 'true', 'lable':'فعال'},
                {'name': 'false', 'lable':'غیر فعال'},
            ]
        },

        nextpayapikey: {
            'name'  : 'کلید api نکست پی',
            'mess'  : 'لطفا کلید api درگاه نکست پی را ارسال کنید.',
        },
        
        contactInfo: {
            name: 'اطلاعات تماس سبد خرید',
            mess: 'آیا شما مایل هستید اطلاعات تماس در بخش سبد خرید از کاربر دریافت شود?',
            items : [
                {'name': 'true', 'lable':'فعال'},
                {'name': 'false', 'lable':'غیر فعال'},
            ]
        },

        shipping: {
            name: 'حمل و نقل',
            mess: 'آیا شما مایل هستید به هر فاکتور هزینه حمل و نقل اضافه شود?',
            items : [
                {'name': 'true', 'lable':'فعال'},
                {'name': 'false', 'lable':'غیر فعال'},
            ]
        },

        shippingCost: {
            'name'  : 'هزینه حمل و نقل',
            'mess'  : 'لطفا هزینه حمل و نقل را ارسال کنید، واحد پول تومان است لطفا مبلغ مورد نظر را به صورت عدد ارسال کنید، مثال: 10000',
        },
        
        shopName: {
            'name': 'نام فروشگاه',
            'mess': 'لطفا نام فروشگاه خود را ارسال کنید.',
        },
        
        browserRules: {
            'name'  : 'قوانین پرداخت',
            'mess'  : 'این قوانین درون مرورگر در بخش قوانین پرداخت نمایش داده می شود.',
        },
        
        browserDescription: {
            'name'  : 'توضیحات بخش مرورگر',
            'mess'  : 'توضیحاتی که میخواهید در صفحه پرداخت مرورگر نمایش داده شود را ارسال کنید.',
        },
    },

    //coupon generator
    generator:{
        sessions: {
            'name': 'دوره',
            'mess': 'لطفا تعداد دوره را برای این بن ارسال کنید. دوره های تعداد کار های خاصی هستند که باید اتفاق بیوفتند تا یک بن صادر شود. برای مثال تعداد دوره در حالت "خرید کردن" منظور تعداد خرید های کاربر است، یا در حالت"عضویت کانال" تعداد روز هایی است که کاربر باید در کانال عضو باشد.',
            'type': Number,
        },

        minimumP: {
            'name': 'حداقل محصول',
            'mess': 'لطفا حداقل تعداد محصول برای صدور بن را مشخص کنید.',
            'type': Number,
        },

        maximumP: {
            'name': 'حداکثر محصول',
            'mess': 'لطفا حداکثر تعداد محصول برای صدور بن را مشخص کنید.',
            'type': Number,
        },

        mode:{
            'name'  : 'حالت صدور',
            'mess'  : 'لطفا حالت استخراج بن ها را انتخاب کنید.',
            'items' : [
                {'name': 'buy', 'lable':'خرید کردن'},
                {'name': 'membership', 'lable':'عضویت در کانال'},
                {'name': 'invite', 'lable':'دعوت کاربران'},
            ],
        },
        
        createtime:{
            'name'  : 'زمان صدور',
            'mess'  : 'آگر حالت صدور، روی خرید کردن تنظیم شده، میتوانید مشخص کنید که آیا کپن بعد از هر خرید صادر شود یا در هنگام خرید.',
            'items' : [
                {'name': 'buying', 'lable':'در لحظه خرید'},
                {'name': 'affter', 'lable':'بعد از خرید'},
            ],
        },

        discountmode: {
            'name': 'نوع تخفیف',
            'mess': 'لطفا حالت بن های تخفیف را مشخص کنید.',
            'items' : [
                {'name': 'amount', 'lable':'نقدی'},
                {'name': 'percent', 'lable':'درصد'},
            ]
        },

        amount:{
            'name': 'مقدار نقدی',
            'mess': 'چند هزار تومان به ازای هر بن، تخفیف داده شود؟',
            'type': Number,
        },

        percent:{
            'name': 'مقدار درصدی',
            'mess': 'چند درصد به ازای هر بن، تخفیف داده شود؟',
            'type': Number,
        },

        days:{
            'name': 'تعداد روز',
            'mess': 'هر بن تخفیف چند روز تاریخ مصرف دارد؟',
            'type': Number,
        },

        hours:{
            'name': 'تعداد ساعت',
            'mess': 'هر بن تخفیف چند ساعت تاریخ مصرف دارد؟',
            'type': Number,
        },

        consumption:{
            'name': 'دفعات مصرف بن',
            'mess': 'هر بن تخفیف چند بار باید مصرف شود.',
            'type': Number,
        },

        consumptionway: {
            'name': 'شیوه استفاده',
            'mess': 'لطفا شیوه استفاده بن های تخفیف را مشخص کنید.',
            'items' : [
                {'name': 'automatic', 'lable':'اتوماتیک'},
                {'name': 'custom', 'lable':'دستی'},
            ]
        },

        status: {
            'name': 'وضعیت',
            'mess': 'لطفا وضعیت بن ساز را مشخص کنید.',
            'items' : [
                {'name': true, 'lable':'فعال'},
                {'name': false, 'lable':'غیر فعال'},
            ]
        },
    }
}