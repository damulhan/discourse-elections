import { default as computed } from 'ember-addons/ember-computed-decorators';
import Category from 'discourse/models/category';
import { ajax } from 'discourse/lib/ajax';

export default Ember.Controller.extend({
  init() {
    this.appEvents.on('header:update-topic', () => {
      this.set('loading', false);
      this.send('closeModal');
    });
  },

  @computed('model.isNominee')
  prefix(isNominee) {
    return `election.nomination.${isNominee ? 'remove' : 'add'}.`;
  },

  @computed('model.categoryId')
  categoryName(categoryId) {
    return Category.findById(categoryId).name;
  },

  actions: {
    toggleNomination() {
      const topicId = this.get('model.topicId');
      const type = this.get('model.isNominee') ? 'DELETE' : 'POST';

      this.set('loading', true);
      ajax('/election/nomination', {
        type,
        data: {
          topic_id: topicId
        }
      })
    }
  }
})
