Module.register('MMM-DailyPower', {
    defaults: {
        width: '75%',
        margin: '0 auto',
        translation: 'de',
        verseColor: '#ccc',
        verseSize: '28px',
        referenceColor: '#ccc',
        referenceSize: '32px',
        showImage: true,
        blackAndWhite: true,
    },

    start: function() {
        const payload = {
            translation: this.config.translation
        };

        this.sendSocketNotification('DAILY_POWER_LOAD_VERSE', payload);
        setInterval(() => {
            this.sendSocketNotification('DAILY_POWER_LOAD_VERSE', payload);
        }, 1000 * 60 * 60);
    },

    getStyles: function() {
        return [
            this.file('styles.css')
        ];
    },

    getDom: function() {
        const wrapper = document.createElement('div');
        wrapper.style.width = this.config.width;
        wrapper.style.margin = this.config.margin;
        if (this.verse) {
            if (this.config.showImage) {
                wrapper.appendChild(this.createVerseImage());
            }
            wrapper.appendChild(this.createVerseCard());
        } else {
            wrapper.innerHTML = this.translate('LOADING');
        }
        return wrapper;
    },

    createVerseImage: function() {
        const imageUrl = this.verse.image;
        let image = document.createElement('img');
        image.classList.add('daily-power-image');
        if (this.config.blackAndWhite) {
            image.classList.add('daily-power-blackAndWhite');
        }
        image.src = imageUrl;
        return image;
    },

    createVerseCard: function() {
        const card = document.createElement('div');
        card.appendChild(this.createVerseContent());
        card.appendChild(this.createVerseReference());
        return card;
    },

    createVerseContent: function() {
        const content = document.createElement('p');
        content.classList.add('daily-power-p', 'daily-power-verse-content');
        content.style.color = this.config.verseColor;
        content.style.fontSize = this.config.verseSize;
        content.innerHTML = this.verse.content;
        return content;
    },

    createVerseReference: function() {
        const reference = document.createElement('p');
        reference.classList.add('daily-power-p', 'daily-power-verse-reference');
        reference.style.color = this.config.referenceColor;
        reference.style.fontSize = this.config.referenceSize;
        reference.innerHTML = this.verse.reference;
        return reference;
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === 'DAILY_POWER_ON_VERSE_RECEIVED') {
            this.verse = payload[0];
            this.updateDom();
        }
    }

});
