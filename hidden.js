(() => {
    let typedKeys = "";
    const SECRET_KEY = "kayra";
    let kayra = false;
    let isHeartClicked = false;
    let isFoodOpen = false;
    let isLoveOpen = false;

    let beatTimer = 0;
    let lastBeatFired = false;
    let currentHeartScale = 0;
    let orbitAngle = 0;

    let activeMemory = null;

    const startDate = new Date("2026-02-11T00:00:00");

    const heartWaves = [];
    const heartCard = {
        x: 0,
        y: 0,
        width: 360,
        height: 145,
        alpha: 0
    };

    const specialCard = {
        x: 0,
        y: 0,
        width: 520,
        height: 320,
        alpha: 0,
        shimmerAngle: 0,
        tiltX: 0,
        tiltY: 0,
        title: "FOR YOU",
        text: "my love \n\nher ne kadar birbirimizden uzak olsakta her zaman kalbime en yakin olan kisi hep sen oldun \n\nseni cok seviyorum kayra ve her an her zaman sevmeye devam edicem \n\nseninle gecirdigim her vakit hayatimin en guzel anlari oldu ve sayende gercekten birine hayatimda ilk defa bu kadar cok guvenebildim"
    };

    const loveTriggerBox = {
        x: 0,
        y: 0,
        width: 390,
        height: 85,
        alpha: 0,
        isHovered: false,
        line1: "Senin her yanına aşığım ve bunlar birazı",
        line2: "just like %0.0000000000000000000000000000000000001 ❤"
    };

    const foodTriggerBox = {
        x: 0,
        y: 0,
        width: 250,
        height: 70,
        alpha: 0,
        isHovered: false,
        title: "Seninle Yediklerimiz"
    };

    const loveReasons = [
        "İçimi rahatlatan o gülüşün",
        "Yanında dururken hissettirdiğin o sonsuz huzur",
        "Her günümü güzelleştiren o ses tonun",
        "Sabah kalktığındaki o tatlı sesin",
        "Küçük şeylere olan pozitifliğin",
        "Bana güven veren o bakışların",
        "Ragebait yediğindeki reactionların",
        "Elimi tuttuğun andaki o güven hissi",
        "Bana her zaman inanıp destek olman",
        "En zor anımda bile beni mutlu edebilmen",
        "Sana sarıldığımda zamanın durması",
        "Yüzünün her bir yanının kusursuzluğu",
        "Sabah kalkınca beni benden alan o dalgalı saçların",
        "Düzleştirince perf olan o saçların ve kâküllerin",
        "Sıcaklayıp benden uzaklaşıp sonra yanıma geri gelmen",
        "Sahip olduğun kindness",
        "Gözlerinin içine her baktığımda büyülenmem",
        "Bana kattığın tüm o güzellikler",
        "Asla güvenimi kırmaman",
        "Öpmekten doyamadığım o dudakların",
        "Sarıldığında bana güven veren o kolların",
        "Bir şey anlatırken heyecanla konuşman",
        "Kokunun üzerime sindiğinde verdiği huzur",
        "Beni her halimle kabul edip sevmen",
        "Sevdiğin yemekleri yerkenki dansın",
        "Geleceğe dair birlikte kurduğumuz hayaller",
        "Bana her gün yeniden aşık olma hissini yaratman",
        "Hem en güzel hem de en yetenekli olman",
        "Bana sinirli davranınca (davranmasan bile) sonrasında arayıp beni düşünmen",
        "Yemeklere olan ilgin, özellikle tatlılara",
        "Kendine olan narsicmin (baya fena seviyorum)",
        "Bana her zaman cute demeni",
        "Ponçiği her an kaldırabilmen",
        "İnsanlara olan haterlığın",
        "Boş boş yaplesem bile dinlemen",
        "Varlığınla hayatımı güzelleştiren her anın"
    ];

    const loveCardWidth = 240;
    const loveCardHeight = 78;

    const loveNodes = Array.from({ length: loveReasons.length }, (_, i) => {
        let ringIndex = 0;
        let countInRing = 10;
        let indexInRing = i;
        let radiusX = 390;
        let radiusY = 250;

        if (i < 10) {
            ringIndex = 0;
            countInRing = 10;
            indexInRing = i;
            radiusX = 390;
            radiusY = 250;
        } else if (i < 22) {
            ringIndex = 1;
            countInRing = 12;
            indexInRing = i - 10;
            radiusX = 640;
            radiusY = 410;
        } else {
            ringIndex = 2;
            countInRing = 14;
            indexInRing = i - 22;
            radiusX = 890;
            radiusY = 570;
        }

        const angle = (indexInRing / countInRing) * Math.PI * 2 + (ringIndex * 0.25);

        return {
            id: `love_${i + 1}`,
            text: loveReasons[i],
            offsetX: Math.cos(angle) * radiusX,
            offsetY: Math.sin(angle) * radiusY,
            x: 0,
            y: 0,
            width: loveCardWidth,
            height: loveCardHeight,
            alpha: 0
        };
    });

    const foodNames = [
        "⁠Ucen dolgulu cookie 🍪", "Nata 🐣", "House of B 🍔", "Sushi Burger 🍣🍔", "⁠Islak Cizburger ✍️🍔",
        "⁠Tramisu Coconut Latte 🥥", "Deli Deli Sandwich 🥪", "Smash Burger 💥🍔", "Nutella Latte ☕️", "Mac and Cheese 🧀",
        "Tra miss u + Cookie", "Boston Donuts 🍩🍩🍩", "San Sebastian 🍰", "Gnocci ❤️⁠", "Crepe Escape 🥞",
        "Sushi 🍣", "⁠Iced Brown Sugar 🫶🏻", "Gnocci ❤️⁠❤️⁠", "Shabby Waffle 🍫", "Joe the Box 📦"
    ];

    const foodCardWidth = 160;
    const foodCardHeight = 130;
    const foodCols = 4;
    const foodSpacingX = 195;
    const foodSpacingY = 150;
    const foodStartOffsetX = 200;
    const foodStartOffsetY = -290;

    const foodConfigs = Array.from({ length: 20 }, (_, i) => {
        const col = i % foodCols;
        const row = Math.floor(i / foodCols);
        const staggerY = (col % 2 === 1 ? 25 : -15) + (row - 2) * 8;
        const staggerX = Math.sin(row * 0.9) * 20;

        return {
            id: `food_${i + 1}`,
            label: foodNames[i] || `Yemek ${i + 1}`,
            offsetX: foodStartOffsetX + col * foodSpacingX + staggerX,
            offsetY: foodStartOffsetY + row * foodSpacingY + staggerY,
            imgSrc: `images/k${i + 1}.jpg`
        };
    });

    const foodNodes = foodConfigs.map((cfg) => {
        const img = new Image();
        img.src = cfg.imgSrc;
        return {
            ...cfg,
            imgObj: img,
            x: 0,
            y: 0,
            width: foodCardWidth,
            height: foodCardHeight,
            alpha: 0
        };
    });

    const memoryConfigs = [
        {
            id: "mem_1",
            label: "❤️",
            color: "#fb7185",
            title: "ILK",
            text: "seninle ilk görüştüğümüz o gün \nsen uçaktan inip gelirken ben hayatımda bu kadar heyecanlı olmamıştım\nSeni görceğim diye kalbim öyle bi atıyoduki kriz geçireeğimi zannettim\nAma seni gördüğüm o an hayatımın en güzel anlarından biri oldu\nİçim öyle bir mutlu oldu ki seni ne kadar sevdiğimi tekrar hatırladım\n\nBana koşup üzerime atlaman ve sana sımsıkı sarılmak çok ama çok ÇOKKKKK güzeldi\n\nİyi ki seninle uzak ilişkiye girişmişim \nasla pişman olmadım ve asla da olmayacağımdan yüzde yüz eminim\nSeninle birlikte olduğum için bu evrendeki en şanslı insanım"
        },
        {
            id: "mem_2",
            label: "🫣",
            color: "#f43f5e",
            title: "Utandigim O An",
            text: "seninle arabada birlikte giderken benim üzerime yatıp bana bakman \no kadar tatlıydı ki gerçekten senin gözlerine baksam utancımdan patlayacaktım \no an kör olsam asla hayata lafım olmazdı \n\nson göreceğim şeyin o gözlerin olması benim için yetmeyi bırak fazla bileydi \n\nellerini sıkıp sana sımsıkı sarılıp o yolculuğu geçirmek bana gerçekten çok huzurlu geldi \n\nseninle birlikte olduğuma harbi çok mutluyum \naynı şekilde seni de hep mutlu edeceğime söz veriyorum"
        },
        {
            id: "mem_3",
            label: "🤞",
            color: "#fda4af",
            title: "Poncik ve Sutlac",
            text: "seni gördüğüm o an dediğim tüm her şeyi yapacağım \nve bana dediklerini de sakın unutma \nyoksa hatırlatacağım her türlü sana \n\numbrella dansını da sana yapacağım söz veriyorum cutie \n\ntiftik tiramisu yiyip de tekrar yapacağız \narka pizza yiyip de yapacağız \nboba tea içip de \n\nher gün love şubat ayı her an her zaman sütlaç ponçik"
        },
        {
            id: "mem_4",
            label: "🌧️",
            color: "#fb7185",
            title: "Yagmurlu O Gun",
            text: "bana harbi o yağmur yağan gün \nhayatımdaki en ihtiyaç duyduğum kişi olduğunu gösterdin \n\nben seni yağmurda üşümeni istemeyerek endişeliyken \nyağmurlu olan o havada bile gülümseyip beni sevdiğini söylemen \nbenim asla unutamayacağım anılardan biri oldu \nhayatıma renk katan o sözlerin ve gülüşünü \nher gözümü kapayışımda görmek her ne kadar güzel gelse de \nseni her saniye salise gerçekten çok özlüyorum \n\nkeşke her an birlikte olabilseydik ama ileride pinky promise yanından hiç ayrılmayacağım"
        },
        {
            id: "mem_5",
            label: "😞",
            color: "#f43f5e",
            title: "Sondu ama Tekrar Gorusecez",
            text: "weed sitesinden çıkıp otobüse binip seninle kalan zamanımın bir bir azalması \nher saniyesi kalbimi parçalıyordu \nseninle olan vaktimin sona ereceğini bilmek kadar acı çektiren bir şey yoktu \niçim her ne kadar yansa da seninle geçirdiğim o vakitte bile bi yandan mutluydum \nhavalimanında seninle oturup beklerken ağlamamak için ne kadar zor tuttum kendimi \nama sen gittikten sonra hayatım boyunca dökmediğim kadar gözyaşı döktüm \no gece seni düşünmekten uyku girmedi gözüme \n\nseni özlemekten içim içimi parçalıyordu\nher günü bu özlemle geçiriyorum my love \ngerçekten çok özlüyorum ama my love yanına geleceğim \nhep geleceğim sen nereye gidersen git her zaman yanında olacağım ve senin en büyük supporturun olacağım \nseni çok seviyorum Kayra \nve çok özlüyorum seni \n\nbu yazıları yazarken bile ağlamamak elimden gelmedi \nI love you SOOOOOOO much"
        },
        {
            id: "mem_6",
            label: "🫶🏻",
            color: "#f43f5e",
            title: "love you sooooOOOOOOOOO much",
            text: "bana kızsan bile hep seni seveceğim \n\ntartışsak bile her an seni çok seveceğim \n\nsenle ne yaşarsak yaşayalım seni her gün daha da sevmeye devam edeceğim \n\n(bana kötü davrandığını söylüyorsun arada ama gerçekten ben seni çok seviyorum bana kötü gibi gelmiyor davranışların hepsi çok cute ve aşırı loveable)"
        }
    ];

    const memoryNodes = memoryConfigs.map((cfg, index) => {
        return {
            ...cfg,
            x: 0,
            y: 0,
            index: index,
            total: memoryConfigs.length,
            radius: 50,
            isHovered: false,
            alpha: 0,
            card: {
                textWidth: 600,
                textHeight: 300,
                alpha: 0,
                tiltX: 0,
                tiltY: 0
            }
        };
    });

    function spawnBigHeartBurst(originX, originY, count = 280) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 16 + 3;
            heartWaves.push({
                type: "burst",
                x: originX,
                y: originY,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity - (Math.random() * 3.5 + 1),
                size: Math.random() * 11 + 6,
                alpha: 1,
                decay: Math.random() * 0.0035 + 0.002
            });
        }
    }

    function getFormattedTimeTogether() {
        const now = new Date();
        const diffMs = Math.max(0, now - startDate);

        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
        const seconds = Math.floor((diffMs / (1000 * 60)) % 60);

        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

    window.addEventListener("keydown", (e) => {
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
            typedKeys += e.key.toLowerCase();
            if (typedKeys.length > SECRET_KEY.length) {
                typedKeys = typedKeys.slice(-SECRET_KEY.length);
            }
            if (typedKeys === SECRET_KEY && !kayra) {
                activateEasterEgg();
            }
        }
    });

    function activateEasterEgg() {
        kayra = true;
        camera.targetX = 0;
        camera.targetY = 0;
        rootNode.expanded = false;
        categoryNodes.forEach(c => c.expanded = false);
        spawnBigHeartBurst(rootNode.x, rootNode.y - 20, 320);
    }

    window.addEventListener("mouseup", () => {
        if (!kayra || mouse.hasMoved) return;

        if (isHeartClicked && loveTriggerBox.isHovered) {
            isLoveOpen = !isLoveOpen;
            if (isLoveOpen) {
                isFoodOpen = false;
                activeMemory = null;
                const targetBoxX = rootNode.x - 1100;
                const targetBoxY = rootNode.y - 30;
                camera.targetX = -(targetBoxX - window.innerWidth / 2);
                camera.targetY = -(targetBoxY - window.innerHeight / 2);
            } else {
                camera.targetX = 0;
                camera.targetY = 0;
            }
            return;
        }

        if (isHeartClicked && foodTriggerBox.isHovered) {
            isFoodOpen = !isFoodOpen;
            if (isFoodOpen) {
                isLoveOpen = false;
                activeMemory = null;
                camera.targetX = -((foodTriggerBox.x + 450) - window.innerWidth / 2);
                camera.targetY = -(foodTriggerBox.y - window.innerHeight / 2);
            } else {
                camera.targetX = 0;
                camera.targetY = 0;
            }
            return;
        }

        if (rootNode.isHovered) {
            isHeartClicked = !isHeartClicked;
            if (!isHeartClicked) {
                activeMemory = null;
                isFoodOpen = false;
                isLoveOpen = false;
            }
            camera.targetX = 0;
            camera.targetY = 0;
            return;
        }

        if (isHeartClicked) {
            const clickedMem = memoryNodes.find(m => m.isHovered);
            if (clickedMem) {
                if (activeMemory === clickedMem) {
                    activeMemory = null;
                    camera.targetX = 0;
                    camera.targetY = 0;
                } else {
                    activeMemory = clickedMem;
                    camera.targetX = -(rootNode.x - window.innerWidth / 2);
                    camera.targetY = -((rootNode.y - 360) - window.innerHeight / 2);
                }
            }
        }
    });

    function drawMiniHeart(cx, cy, size, color, alpha) {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        const topCurve = size * 0.3;
        ctx.moveTo(cx, cy + topCurve);
        ctx.bezierCurveTo(cx, cy - topCurve * 0.8, cx - size / 2, cy - topCurve * 0.8, cx - size / 2, cy + topCurve);
        ctx.bezierCurveTo(cx - size / 2, cy + size * 0.5, cx, cy + size * 0.75, cx, cy + size);
        ctx.bezierCurveTo(cx, cy + size * 0.75, cx + size / 2, cy + size * 0.5, cx + size / 2, cy + topCurve);
        ctx.bezierCurveTo(cx + size / 2, cy - topCurve * 0.8, cx, cy - topCurve * 0.8, cx, cy + topCurve);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
    }

    function drawHeartShape(cx, cy, size, color) {
        ctx.save();
        ctx.beginPath();
        const topCurveHeight = size * 0.3;
        ctx.moveTo(cx, cy + topCurveHeight);
        ctx.bezierCurveTo(cx, cy - topCurveHeight * 0.8, cx - size / 2, cy - topCurveHeight * 0.8, cx - size / 2, cy + topCurveHeight);
        ctx.bezierCurveTo(cx - size / 2, cy + size * 0.5, cx, cy + size * 0.75, cx, cy + size);
        ctx.bezierCurveTo(cx, cy + size * 0.75, cx + size / 2, cy + size * 0.5, cx + size / 2, cy + topCurveHeight);
        ctx.bezierCurveTo(cx + size / 2, cy - topCurveHeight * 0.8, cx, cy - topCurveHeight * 0.8, cx, cy + topCurveHeight);
        ctx.closePath();

        const rad = ctx.createRadialGradient(cx, cy, size * 0.1, cx, cy, size);
        rad.addColorStop(0, "#2a081a");
        rad.addColorStop(1, "#0a040b");
        ctx.fillStyle = rad;
        ctx.fill();

        ctx.strokeStyle = color;
        ctx.lineWidth = 4;
        ctx.shadowColor = color;
        ctx.shadowBlur = 30;
        ctx.stroke();
        ctx.restore();
    }

    function drawRoundedRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }

    const originalUpdate = window.update;
    const originalDraw = window.draw;

    window.update = function() {
        if (!kayra) {
            originalUpdate();
            return;
        }

        camera.x += (camera.targetX - camera.x) * lerpFactor;
        camera.y += (camera.targetY - camera.y) * lerpFactor;

        beatTimer += 0.035;
        if (beatTimer > Math.PI * 2) {
            beatTimer -= Math.PI * 2;
        }

        specialCard.shimmerAngle += 0.025;

        if (!activeMemory) {
            orbitAngle += 0.005;
        }

        currentHeartScale = Math.max(0, Math.pow(Math.sin(beatTimer), 63)) * 18 
                          + Math.max(0, Math.pow(Math.sin(beatTimer - 0.4), 63)) * 12;

        if (currentHeartScale > 14 && !lastBeatFired) {
            heartWaves.push({
                type: "ring",
                radius: 80,
                maxRadius: Math.max(window.innerWidth, window.innerHeight) * 1.4,
                speed: 2,
                alpha: 0.9
            });
            lastBeatFired = true;
        } else if (currentHeartScale < 2) {
            lastBeatFired = false;
        }

        if (Math.random() < 0.15) {
            heartWaves.push({
                type: "ember",
                x: rootNode.x + (Math.random() - 0.5) * 160,
                y: rootNode.y + 40,
                vy: -(Math.random() * 1.0 + 0.4),
                size: Math.random() * 2 + 1,
                alpha: 0.85
            });
        }

        for (let i = heartWaves.length - 1; i >= 0; i--) {
            const item = heartWaves[i];
            if (item.type === "ring") {
                item.radius += item.speed;
                item.alpha = Math.max(0, 1 - (item.radius / item.maxRadius));
                if (item.radius >= item.maxRadius || item.alpha <= 0.01) {
                    heartWaves.splice(i, 1);
                }
            } else if (item.type === "ember") {
                item.y += item.vy;
                item.alpha -= 0.005;
                if (item.alpha <= 0) {
                    heartWaves.splice(i, 1);
                }
            } else if (item.type === "burst") {
                item.x += item.vx;
                item.y += item.vy;
                item.vx *= 0.985;
                item.vy = item.vy * 0.985 - 0.015;
                item.alpha -= item.decay;
                if (item.alpha <= 0) {
                    heartWaves.splice(i, 1);
                }
            }
        }

        if (mouse.x !== null && mouse.y !== null) {
            const distToHeart = Math.hypot(mouse.x - rootNode.x, mouse.y - (rootNode.y - 15));
            rootNode.isHovered = distToHeart <= 75;
        } else {
            rootNode.isHovered = false;
        }

        heartCard.x = rootNode.x;
        const targetDistY = isHeartClicked ? rootNode.y + 270 : rootNode.y + 35;
        const targetAlpha = isHeartClicked ? 1 : 0;
        heartCard.y += (targetDistY - heartCard.y) * lerpFactor;
        heartCard.alpha += (targetAlpha - heartCard.alpha) * lerpFactor;

        specialCard.x = rootNode.x;
        const targetSpecialY = isHeartClicked ? heartCard.y + heartCard.height + 1000 : rootNode.y + 270;
        const targetSpecialAlpha = isHeartClicked ? 1 : 0;
        specialCard.y += (targetSpecialY - specialCard.y) * lerpFactor;
        specialCard.alpha += (targetSpecialAlpha - specialCard.alpha) * lerpFactor;

        if (specialCard.alpha > 0.05 && mouse.x !== null && mouse.y !== null) {
            const scX = specialCard.x - specialCard.width / 2;
            const scY = specialCard.y;
            const isHoveringSpecial = mouse.x >= scX && mouse.x <= scX + specialCard.width &&
                                      mouse.y >= scY && mouse.y <= scY + specialCard.height;
            const targetTiltX = isHoveringSpecial ? (mouse.x - specialCard.x) * 0.04 : 0;
            const targetTiltY = isHoveringSpecial ? (mouse.y - (specialCard.y + specialCard.height / 2)) * 0.04 : 0;
            specialCard.tiltX += (targetTiltX - specialCard.tiltX) * 0.08;
            specialCard.tiltY += (targetTiltY - specialCard.tiltY) * 0.08;
        } else {
            specialCard.tiltX += (0 - specialCard.tiltX) * 0.08;
            specialCard.tiltY += (0 - specialCard.tiltY) * 0.08;
        }

        const targetSideAlpha = isHeartClicked ? 1 : 0;
        const sideCardDistY = rootNode.y - 30;

        const targetLoveBoxX = isLoveOpen ? (rootNode.x - 1100) : (rootNode.x - 600);
        loveTriggerBox.x += (targetLoveBoxX - loveTriggerBox.x) * lerpFactor;
        loveTriggerBox.y += (sideCardDistY - loveTriggerBox.y) * lerpFactor;
        loveTriggerBox.alpha += (targetSideAlpha - loveTriggerBox.alpha) * lerpFactor;

        if (isHeartClicked && mouse.x !== null && mouse.y !== null) {
            const ltbX = loveTriggerBox.x - loveTriggerBox.width / 2;
            const ltbY = loveTriggerBox.y - loveTriggerBox.height / 2;
            loveTriggerBox.isHovered = mouse.x >= ltbX && mouse.x <= ltbX + loveTriggerBox.width &&
                                      mouse.y >= ltbY && mouse.y <= ltbY + loveTriggerBox.height;
        } else {
            loveTriggerBox.isHovered = false;
        }

        const targetLoveAlpha = (isHeartClicked && isLoveOpen) ? 1 : 0;
        loveNodes.forEach((node) => {
            const targetNodeX = loveTriggerBox.x + node.offsetX;
            const targetNodeY = loveTriggerBox.y + node.offsetY;

            node.x += (targetNodeX - node.x) * lerpFactor;
            node.y += (targetNodeY - node.y) * lerpFactor;
            node.alpha += (targetLoveAlpha - node.alpha) * lerpFactor;
        });

        foodTriggerBox.x += ((rootNode.x + 600) - foodTriggerBox.x) * lerpFactor;
        foodTriggerBox.y += (sideCardDistY - foodTriggerBox.y) * lerpFactor;
        foodTriggerBox.alpha += (targetSideAlpha - foodTriggerBox.alpha) * lerpFactor;

        if (isHeartClicked && mouse.x !== null && mouse.y !== null) {
            const ftbX = foodTriggerBox.x - foodTriggerBox.width / 2;
            const ftbY = foodTriggerBox.y - foodTriggerBox.height / 2;
            foodTriggerBox.isHovered = mouse.x >= ftbX && mouse.x <= ftbX + foodTriggerBox.width &&
                                      mouse.y >= ftbY && mouse.y <= ftbY + foodTriggerBox.height;
        } else {
            foodTriggerBox.isHovered = false;
        }

        const targetFoodAlpha = (isHeartClicked && isFoodOpen) ? 1 : 0;
        const rightEdgeX = foodTriggerBox.x + foodTriggerBox.width / 2;
        const foodCenterY = foodTriggerBox.y;

        foodNodes.forEach((food) => {
            const targetFoodX = rightEdgeX + food.offsetX;
            const targetFoodY = foodCenterY + food.offsetY;

            food.x += (targetFoodX - food.x) * lerpFactor;
            food.y += (targetFoodY - food.y) * lerpFactor;
            food.alpha += (targetFoodAlpha - food.alpha) * lerpFactor;
        });

        let anyMemHovered = false;
        const memoryOrbitDist = 250;

        memoryNodes.forEach((mem) => {
            let targetX, targetY;

            if (isHeartClicked) {
                if (activeMemory === mem) {
                    targetX = rootNode.x;
                    targetY = rootNode.y - 250;
                } else {
                    const angle = orbitAngle + (mem.index / mem.total) * (Math.PI * 2);
                    targetX = rootNode.x + Math.cos(angle) * memoryOrbitDist;
                    targetY = (rootNode.y - 15) + Math.sin(angle) * (memoryOrbitDist * 0.75);
                }
                mem.x += (targetX - mem.x) * lerpFactor;
                mem.y += (targetY - mem.y) * lerpFactor;
            } else {
                mem.x += (rootNode.x - mem.x) * (lerpFactor * 2);
                mem.y += (rootNode.y - mem.y) * (lerpFactor * 2);
            }

            const targetMemAlpha = isHeartClicked ? 1 : 0;
            mem.alpha += (targetMemAlpha - mem.alpha) * lerpFactor;

            if (isHeartClicked && mouse.x !== null && mouse.y !== null) {
                const d = Math.hypot(mouse.x - mem.x, mouse.y - mem.y);
                mem.isHovered = d <= mem.radius + 6;
                if (mem.isHovered) anyMemHovered = true;
            } else {
                mem.isHovered = false;
            }

            const isPinned = isHeartClicked && activeMemory === mem;
            const targetStoryAlpha = isPinned ? 1 : 0;
            mem.card.alpha += (targetStoryAlpha - mem.card.alpha) * lerpFactor;

            if (mem.card.alpha > 0.05 && mouse.x !== null && mouse.y !== null) {
                const boxX = mem.x - mem.card.textWidth / 2;
                const boxY = mem.y - mem.card.textHeight - 44;
                const isHoveringCard = mouse.x >= boxX && mouse.x <= boxX + mem.card.textWidth &&
                                       mouse.y >= boxY && mouse.y <= boxY + mem.card.textHeight;
                const targetCardTiltX = isHoveringCard ? (mouse.x - mem.x) * 0.04 : 0;
                const targetCardTiltY = isHoveringCard ? (mouse.y - (boxY + mem.card.textHeight / 2)) * 0.04 : 0;
                mem.card.tiltX += (targetCardTiltX - mem.card.tiltX) * 0.08;
                mem.card.tiltY += (targetCardTiltY - mem.card.tiltY) * 0.08;
            } else {
                mem.card.tiltX += (0 - mem.card.tiltX) * 0.08;
                mem.card.tiltY += (0 - mem.card.tiltY) * 0.08;
            }
        });

        const anyButtonHovered = loveTriggerBox.isHovered || foodTriggerBox.isHovered;
        canvas.style.cursor = (rootNode.isHovered || anyMemHovered || anyButtonHovered) ? "pointer" : (isDraggingCamera ? "grabbing" : "default");
    };

    window.draw = function() {
        if (!kayra) {
            originalDraw();
            return;
        }

        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        ctx.save();
        ctx.translate(camera.x, camera.y);

        heartWaves.forEach((item) => {
            ctx.save();
            if (item.type === "ring") {
                ctx.beginPath();
                ctx.arc(rootNode.x, rootNode.y, item.radius, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(244, 63, 94, ${item.alpha})`;
                ctx.lineWidth = 15;
                ctx.shadowColor = "#f43f5e";
                ctx.shadowBlur = 40;
                ctx.stroke();
            } else if (item.type === "ember") {
                ctx.beginPath();
                ctx.arc(item.x, item.y, item.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(251, 113, 133, ${item.alpha})`;
                ctx.shadowColor = "#f43f5e";
                ctx.shadowBlur = 8;
                ctx.fill();
            } else if (item.type === "burst") {
                drawMiniHeart(item.x, item.y, item.size, "#f43f5e", item.alpha);
            }
            ctx.restore();
        });

        if (isHeartClicked && memoryNodes.some(m => m.alpha > 0.05)) {
            memoryNodes.forEach((mem) => {
                if (mem.alpha <= 0.05) return;

                ctx.save();
                ctx.globalAlpha = mem.alpha * (activeMemory === mem ? 0.7 : 0.45);
                ctx.beginPath();
                ctx.moveTo(rootNode.x, rootNode.y - 15);
                ctx.lineTo(mem.x, mem.y);
                ctx.strokeStyle = mem.color;
                ctx.lineWidth = activeMemory === mem ? 5 : 2;
                ctx.stroke();
                ctx.restore();
            });
        }

        const heartBottomY = rootNode.y + 45;
        if (heartCard.alpha > 0.05) {
            ctx.save();
            ctx.globalAlpha = heartCard.alpha;

            ctx.beginPath();
            ctx.moveTo(rootNode.x, heartBottomY);
            ctx.lineTo(heartCard.x, heartCard.y);
            ctx.strokeStyle = "#f43f5e";
            ctx.lineWidth = 2.5;
            ctx.shadowColor = "#f43f5e";
            ctx.shadowBlur = 15;
            ctx.stroke();

            const boxX = heartCard.x - heartCard.width / 2;
            const boxY = heartCard.y;

            drawRoundedRect(ctx, boxX, boxY, heartCard.width, heartCard.height, 16);
            ctx.fillStyle = "rgba(15, 23, 42, 0.82)";
            ctx.fill();

            ctx.strokeStyle = "rgba(244, 63, 94, 0.55)";
            ctx.lineWidth = 10;
            ctx.shadowColor = "#f43f5e";
            ctx.shadowBlur = 24;
            ctx.stroke();

            ctx.shadowBlur = 0;
            ctx.fillStyle = "#fda4af";
            ctx.font = "bold 16px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText("FOR KAYRA", heartCard.x, boxY + 30);

            ctx.fillStyle = "#ffffff";
            ctx.font = "600 21px sans-serif";
            ctx.fillText("I love you so much", heartCard.x, boxY + 62);

            const timerStr = getFormattedTimeTogether();
            ctx.fillStyle = "#fb7185";
            ctx.font = "bold 17px sans-serif";
            ctx.fillText(`${timerStr} loving you ✨`, heartCard.x, boxY + 95);

            ctx.fillStyle = "#94a3b8";
            ctx.font = "15px sans-serif";
            ctx.fillText("Thank you for everything, my love ❤", heartCard.x, boxY + 122);

            ctx.restore();
        }

        if (specialCard.alpha > 0.05) {
            ctx.save();
            ctx.globalAlpha = specialCard.alpha;

            const startY = heartCard.y + heartCard.height;
            const endY = specialCard.y;

            ctx.save();
            ctx.setLineDash([8, 6]);
            ctx.beginPath();
            ctx.moveTo(specialCard.x, startY);
            ctx.lineTo(specialCard.x, endY);
            ctx.strokeStyle = "rgba(251, 113, 133, 0.45)";
            ctx.lineWidth = 2.5;
            ctx.shadowColor = "#fb7185";
            ctx.shadowBlur = 40;
            ctx.stroke();
            ctx.restore();

            const orbY = startY + (endY - startY) * 0.5;
            drawMiniHeart(specialCard.x, orbY - 8, 14, "#f43f5e", specialCard.alpha * 0.9);

            const sX = specialCard.x - specialCard.width / 2;
            const sY = specialCard.y;
            const sW = specialCard.width;
            const sH = specialCard.height;

            ctx.save();
            ctx.translate(specialCard.tiltX, specialCard.tiltY);

            const bgGrad = ctx.createLinearGradient(sX, sY, sX + sW, sY + sH);
            bgGrad.addColorStop(0, "rgba(26, 11, 28, 0.94)");
            bgGrad.addColorStop(0.5, "rgba(15, 23, 42, 0.92)");
            bgGrad.addColorStop(1, "rgba(35, 10, 24, 0.94)");

            drawRoundedRect(ctx, sX, sY, sW, sH, 20);
            ctx.fillStyle = bgGrad;
            ctx.fill();

            const borderGrad = ctx.createLinearGradient(
                sX + Math.cos(specialCard.shimmerAngle) * sW,
                sY,
                sX + Math.sin(specialCard.shimmerAngle) * sW,
                sY + sH
            );
            borderGrad.addColorStop(0, "#f43f5e");
            borderGrad.addColorStop(0.3, "#fda4af");
            borderGrad.addColorStop(0.7, "#fb7185");
            borderGrad.addColorStop(1, "#f43f5e");

            ctx.strokeStyle = borderGrad;
            ctx.lineWidth = 2.5;
            ctx.shadowColor = "#fb7185";
            ctx.shadowBlur = 40;
            ctx.stroke();
            ctx.shadowBlur = 0;

            const cornerSize = 20;
            const inset = 12;
            ctx.save();
            ctx.strokeStyle = "#fda4af";
            ctx.lineWidth = 2;
            ctx.shadowColor = "#f43f5e";
            ctx.shadowBlur = 8;

            ctx.beginPath();
            ctx.moveTo(sX + inset, sY + inset + cornerSize);
            ctx.lineTo(sX + inset, sY + inset);
            ctx.lineTo(sX + inset + cornerSize, sY + inset);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(sX + sW - inset - cornerSize, sY + inset);
            ctx.lineTo(sX + sW - inset, sY + inset);
            ctx.lineTo(sX + sW - inset, sY + inset + cornerSize);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(sX + inset, sY + sH - inset - cornerSize);
            ctx.lineTo(sX + inset, sY + sH - inset);
            ctx.lineTo(sX + inset + cornerSize, sY + sH - inset);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(sX + sW - inset - cornerSize, sY + sH - inset);
            ctx.lineTo(sX + sW - inset, sY + sH - inset);
            ctx.lineTo(sX + sW - inset, sY + sH - inset - cornerSize);
            ctx.stroke();
            ctx.restore();

            const badgeW = 210;
            const badgeH = 24;
            const badgeX = specialCard.x - badgeW / 2;
            const badgeY = sY + 22;

            drawRoundedRect(ctx, badgeX, badgeY, badgeW, badgeH, 12);
            ctx.fillStyle = "rgba(244, 63, 94, 0.2)";
            ctx.fill();
            ctx.strokeStyle = "rgba(251, 113, 133, 0.6)";
            ctx.lineWidth = 1.2;
            ctx.stroke();

            ctx.fillStyle = "#fda4af";
            ctx.font = "bold 14px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText("✦  " + specialCard.title + "  ✦", specialCard.x, badgeY + 16);

            ctx.fillStyle = "#f1f5f9";
            ctx.font = "17px serif";
            ctx.textAlign = "left";

            const textPaddingX = 36;
            const maxLineWidth = sW - textPaddingX * 2;
            const lineHeight = 24;
            let lineY = sY + 76;

            const paragraphs = specialCard.text.split("\n");
            for (let p = 0; p < paragraphs.length; p++) {
                const words = paragraphs[p].split(" ");
                let currentLine = "";

                if (paragraphs[p] === "") {
                    lineY += lineHeight * 0.7;
                    continue;
                }

                for (let i = 0; i < words.length; i++) {
                    const test = currentLine + words[i] + " ";
                    if (ctx.measureText(test).width > maxLineWidth && i > 0) {
                        ctx.fillText(currentLine, sX + textPaddingX, lineY);
                        currentLine = words[i] + " ";
                        lineY += lineHeight;
                    } else {
                        currentLine = test;
                    }
                }
                ctx.fillText(currentLine, sX + textPaddingX, lineY);
                lineY += lineHeight;
            }

            ctx.fillStyle = "#fb7185";
            ctx.font = "italic 19px serif";
            ctx.textAlign = "right";
            ctx.fillText("Forever yours, always ❤", sX + sW - 36, sY + sH - 24);

            ctx.restore();
            ctx.restore();
        }

        if (loveTriggerBox.alpha > 0.05) {
            ctx.save();
            ctx.globalAlpha = loveTriggerBox.alpha;

            ctx.beginPath();
            ctx.moveTo(rootNode.x, rootNode.y - 15);
            ctx.lineTo(loveTriggerBox.x, loveTriggerBox.y);
            ctx.strokeStyle = "rgba(244, 63, 94, 0.35)";
            ctx.lineWidth = 1.5;
            ctx.stroke();

            const ltbX = loveTriggerBox.x - loveTriggerBox.width / 2;
            const ltbY = loveTriggerBox.y - loveTriggerBox.height / 2;

            drawRoundedRect(ctx, ltbX, ltbY, loveTriggerBox.width, loveTriggerBox.height, 16);
            ctx.fillStyle = loveTriggerBox.isHovered || isLoveOpen ? "rgba(38, 14, 32, 0.96)" : "rgba(15, 23, 42, 0.9)";
            ctx.fill();

            ctx.strokeStyle = loveTriggerBox.isHovered || isLoveOpen ? "#fb7185" : "rgba(244, 63, 94, 0.45)";
            ctx.lineWidth = loveTriggerBox.isHovered || isLoveOpen ? 2.8 : 1.5;
            ctx.shadowColor = "#f43f5e";
            ctx.shadowBlur = loveTriggerBox.isHovered || isLoveOpen ? 24 : 10;
            ctx.stroke();
            ctx.shadowBlur = 0;

            ctx.fillStyle = loveTriggerBox.isHovered || isLoveOpen ? "#ffffff" : "#fda4af";
            ctx.font = "bold 16px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(loveTriggerBox.line1, loveTriggerBox.x, loveTriggerBox.y - 10);

            ctx.fillStyle = "#fb7185";
            ctx.font = "italic 14px sans-serif";
            ctx.fillText(loveTriggerBox.line2, loveTriggerBox.x, loveTriggerBox.y + 18);

            ctx.restore();
        }

        if (isLoveOpen) {
            loveNodes.forEach((node) => {
                if (node.alpha <= 0.05) return;

                ctx.save();
                ctx.globalAlpha = node.alpha * 0.38;
                ctx.beginPath();
                ctx.moveTo(loveTriggerBox.x, loveTriggerBox.y);
                ctx.lineTo(node.x, node.y);
                ctx.strokeStyle = "#fb7185";
                ctx.lineWidth = 1.4;
                ctx.shadowColor = "#f43f5e";
                ctx.shadowBlur = 8;
                ctx.stroke();
                ctx.restore();

                ctx.save();
                ctx.globalAlpha = node.alpha;

                const nX = node.x - node.width / 2;
                const nY = node.y - node.height / 2;

                drawRoundedRect(ctx, nX, nY, node.width, node.height, 12);
                ctx.fillStyle = "rgba(15, 23, 42, 0.94)";
                ctx.fill();

                ctx.strokeStyle = "rgba(251, 113, 133, 0.65)";
                ctx.lineWidth = 1.6;
                ctx.shadowColor = "#f43f5e";
                ctx.shadowBlur = 12;
                ctx.stroke();
                ctx.shadowBlur = 0;

                ctx.fillStyle = "#f43f5e";
                ctx.font = "bold 13px sans-serif";
                ctx.textAlign = "left";
                ctx.fillText("❤", nX + 10, nY + 24);

                ctx.fillStyle = "#cbd5e1";
                ctx.font = "13px sans-serif";

                const maxTextW = node.width - 36;
                const words = node.text.split(" ");
                let currentLine = "";
                let startY = nY + 24;

                for (let w of words) {
                    const testLine = currentLine + w + " ";
                    if (ctx.measureText(testLine).width > maxTextW && currentLine !== "") {
                        ctx.fillText(currentLine.trim(), nX + 26, startY);
                        currentLine = w + " ";
                        startY += 18;
                    } else {
                        currentLine = testLine;
                    }
                }
                ctx.fillText(currentLine.trim(), nX + 26, startY);

                ctx.restore();
            });
        }

        if (foodTriggerBox.alpha > 0.05) {
            ctx.save();
            ctx.globalAlpha = foodTriggerBox.alpha;

            ctx.beginPath();
            ctx.moveTo(rootNode.x, rootNode.y - 15);
            ctx.lineTo(foodTriggerBox.x, foodTriggerBox.y);
            ctx.strokeStyle = "rgba(244, 63, 94, 0.35)";
            ctx.lineWidth = 1.5;
            ctx.stroke();

            const ftbX = foodTriggerBox.x - foodTriggerBox.width / 2;
            const ftbY = foodTriggerBox.y - foodTriggerBox.height / 2;

            drawRoundedRect(ctx, ftbX, ftbY, foodTriggerBox.width, foodTriggerBox.height, 14);
            ctx.fillStyle = foodTriggerBox.isHovered || isFoodOpen ? "rgba(35, 15, 30, 0.95)" : "rgba(15, 23, 42, 0.9)";
            ctx.fill();

            ctx.strokeStyle = foodTriggerBox.isHovered || isFoodOpen ? "#fb7185" : "rgba(244, 63, 94, 0.45)";
            ctx.lineWidth = foodTriggerBox.isHovered || isFoodOpen ? 2.5 : 1.5;
            ctx.shadowColor = "#f43f5e";
            ctx.shadowBlur = foodTriggerBox.isHovered || isFoodOpen ? 20 : 10;
            ctx.stroke();
            ctx.shadowBlur = 0;

            ctx.fillStyle = foodTriggerBox.isHovered || isFoodOpen ? "#ffffff" : "#fda4af";
            ctx.font = "bold 16px sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(foodTriggerBox.title, foodTriggerBox.x, foodTriggerBox.y);

            ctx.restore();
        }

        if (isFoodOpen) {
            const triggerRightX = foodTriggerBox.x + foodTriggerBox.width / 2;
            const triggerCenterY = foodTriggerBox.y;

            foodNodes.forEach((food) => {
                if (food.alpha <= 0.05) return;

                ctx.save();
                ctx.globalAlpha = food.alpha * 0.4;
                ctx.beginPath();
                ctx.moveTo(triggerRightX, triggerCenterY);
                ctx.bezierCurveTo(
                    triggerRightX + 80, triggerCenterY,
                    food.x - food.width / 2 - 40, food.y,
                    food.x - food.width / 2, food.y
                );
                ctx.strokeStyle = "#fb7185";
                ctx.lineWidth = 1.4;
                ctx.shadowColor = "#f43f5e";
                ctx.shadowBlur = 10;
                ctx.stroke();
                ctx.restore();

                ctx.save();
                ctx.globalAlpha = food.alpha;

                const fX = food.x - food.width / 2;
                const fY = food.y - food.height / 2;

                drawRoundedRect(ctx, fX, fY, food.width, food.height, 12);
                ctx.fillStyle = "rgba(15, 23, 42, 0.92)";
                ctx.fill();

                ctx.strokeStyle = "rgba(251, 113, 133, 0.65)";
                ctx.lineWidth = 1.8;
                ctx.shadowColor = "#f43f5e";
                ctx.shadowBlur = 12;
                ctx.stroke();
                ctx.shadowBlur = 0;

                ctx.save();
                drawRoundedRect(ctx, fX + 5, fY + 5, food.width - 10, food.height - 30, 8);
                ctx.clip();
                if (food.imgObj && food.imgObj.complete && food.imgObj.naturalWidth !== 0) {
                    ctx.drawImage(food.imgObj, fX + 5, fY + 5, food.width - 10, food.height - 30);
                } else {
                    ctx.fillStyle = "#1e293b";
                    ctx.fillRect(fX + 5, fY + 5, food.width - 10, food.height - 30);
                    ctx.fillStyle = "#94a3b8";
                    ctx.font = "bold 12px sans-serif";
                    ctx.textAlign = "center";
                    ctx.fillText("Yükleniyor...", food.x, fY + (food.height - 30) / 2);
                }
                ctx.restore();

                ctx.fillStyle = "#fda4af";
                ctx.font = "bold 12px sans-serif";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(food.label, food.x, fY + food.height - 12);

                ctx.restore();
            });
        }

        memoryNodes.forEach((mem) => {
            if (mem.alpha <= 0.05) return;

            ctx.save();
            ctx.globalAlpha = mem.alpha;

            ctx.beginPath();
            ctx.arc(mem.x, mem.y, mem.radius, 0, Math.PI * 2);
            ctx.fillStyle = mem.isHovered || activeMemory === mem ? "#1e1b4b" : "#0f172a";
            ctx.fill();
            ctx.strokeStyle = mem.color;
            ctx.lineWidth = mem.isHovered || activeMemory === mem ? 5 : 3;
            ctx.shadowColor = mem.color;
            ctx.shadowBlur = 30;
            ctx.stroke();

            ctx.shadowBlur = 0;
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 30px sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(mem.label, mem.x, mem.y);

            if (mem.card.alpha > 0.05) {
                ctx.save();
                ctx.globalAlpha = mem.card.alpha * mem.alpha;

                const textW = mem.card.textWidth;
                const textH = mem.card.textHeight;

                const storyBoxY = mem.y - textH - 44;
                const storyBoxX = mem.x - textW / 2;

                ctx.beginPath();
                ctx.moveTo(mem.x, mem.y - mem.radius);
                ctx.lineTo(mem.x, storyBoxY + textH);
                ctx.strokeStyle = mem.color;
                ctx.lineWidth = 1.5;
                ctx.stroke();

                ctx.save();
                ctx.translate(mem.card.tiltX, mem.card.tiltY);

                drawRoundedRect(ctx, storyBoxX, storyBoxY, textW, textH, 14);
                ctx.fillStyle = "rgba(11, 15, 25, 0.88)";
                ctx.fill();

                ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
                ctx.lineWidth = 1;
                ctx.stroke();

                ctx.save();
                ctx.beginPath();
                drawRoundedRect(ctx, storyBoxX, storyBoxY, 4, textH, 2);
                ctx.fillStyle = mem.color;
                ctx.shadowColor = mem.color;
                ctx.shadowBlur = 10;
                ctx.fill();
                ctx.restore();

                ctx.save();
                ctx.beginPath();
                drawRoundedRect(ctx, storyBoxX + textW - 4, storyBoxY, 4, textH, 2);
                ctx.fillStyle = mem.color;
                ctx.shadowColor = mem.color;
                ctx.shadowBlur = 10;
                ctx.fill();
                ctx.restore();

                ctx.shadowBlur = 0;
                ctx.fillStyle = mem.color;
                ctx.font = "bold 16px sans-serif";
                ctx.textAlign = "left";
                ctx.fillText(mem.title, storyBoxX + 16, storyBoxY + 30);

                ctx.fillStyle = "#cbd5e1";
                ctx.font = "15px sans-serif";

                const maxWidth = textW - 32;
                const lineHeight = 20;
                let textY = storyBoxY + 54;

                const paragraphs = mem.text.split("\n");
                for (let p = 0; p < paragraphs.length; p++) {
                    const words = paragraphs[p].split(" ");
                    let currentLine = "";

                    if (paragraphs[p] === "") {
                        textY += lineHeight * 0.7;
                        continue;
                    }

                    for (let n = 0; n < words.length; n++) {
                        const testLine = currentLine + words[n] + " ";
                        const metrics = ctx.measureText(testLine);
                        if (metrics.width > maxWidth && n > 0) {
                            ctx.fillText(currentLine, storyBoxX + 16, textY);
                            currentLine = words[n] + " ";
                            textY += lineHeight;
                        } else {
                            currentLine = testLine;
                        }
                    }
                    ctx.fillText(currentLine, storyBoxX + 16, textY);
                    textY += lineHeight;
                }

                ctx.restore();
                ctx.restore();
            }

            ctx.restore();
        });

        drawHeartShape(rootNode.x, rootNode.y - 70, 135 + currentHeartScale, rootNode.isHovered ? "#fb7185" : "#f43f5e");

        ctx.restore();
    };
})();