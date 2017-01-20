import { GraphRequest, GraphRequestManager } from 'react-native-fbsdk';

function graphRequest(path, parameters, accessToken, callback) {
  const fields = { parameters };
  if (accessToken) {
    fields.accessToken = accessToken;
  }
  const infoRequest = new GraphRequest(
    path,
    fields,
    (error, result) => callback(error, result),
  );

  new GraphRequestManager().addRequest(infoRequest).start();
}

export const accounts = callback => graphRequest('/me/accounts', { fields: { string: 'id,access_token,category,cover,name,picture' }, limit: { string: '100' } }, null, callback);

export const audienceNetwork = (appId, eventName, aggregateBy, breakdown, startDate, endDate, callback) => graphRequest(
  `/${appId}/app_insights/app_event`,
  {
    event_name: { string: eventName },
    aggregateBy: { string: aggregateBy },
    breakdowns: { string: breakdown ? `["${breakdown.toLowerCase()}"]` : '[]' },
    // breakdowns: { string: '["placement"]' },
    // breakdowns: { string: '["country"]' },
    summary: { string: 'true' },
    since: { string: (startDate.getTime() / 1000).toString() },
    until: { string: (endDate.getTime() / 1000).toString() },
  },
  null,
  callback,
);

export const checkAppId = (appId, callback) => graphRequest(`/${appId}`, { fields: { string: 'id,name,category,logo_url' } }, null, callback);

export const FEED_PUBLISHED = 'published';
export const FEED_UNPUBLISHED = 'unpublished';
export const FEED_ALL = 'all';

export const feed = (pageId, postsToShow = FEED_PUBLISHED, limit = 100, pageAccessToken, callback) => {
  let path = `/${pageId}`;
  const parameters = {
    // fields: { string: 'id,admin_creator,application,caption,created_time,description,from,icon,is_hidden,link,message,message_tags,name,object_id,full_picture,place,properties,shares,source,to,type,scheduled_publish_time' },
    fields: { string: 'id,admin_creator,application,caption,comments.limit(1).summary(true),created_time,description,from,likes.limit(1).summary(true),link,message,name,full_picture,place,shares,source,to,type,scheduled_publish_time' },
    limit: { string: limit.toString() },
  };
  if (postsToShow === FEED_PUBLISHED) {
    path += '/feed';
  } else {
    path += '/promotable_posts';
    if (postsToShow !== FEED_ALL) {
      parameters.is_published = { string: 'false' };
    }
  }

  graphRequest(
    path,
    parameters,
    pageAccessToken,
    callback,
  );
};

export const POST_PUBLISHED = 'published';
export const POST_UNPUBLISHED = 'unpublished';
export const POST_SCHEDULE = 'schedule';

export const publish = (pageId, publishedOrUnpublished = POST_PUBLISHED, text, scheduledPublishTime, pageAccessToken, callback) => {
  const parameters = {
    message: { string: text },
  };

  if (publishedOrUnpublished !== POST_PUBLISHED) {
    parameters.published = { string: 'false' };
  }

  if (publishedOrUnpublished === POST_SCHEDULE) {
    parameters.scheduled_publish_time = { string: Math.round(scheduledPublishTime.getTime() / 1000).toString() };
  }

  const infoRequest = new GraphRequest(
    `/${pageId}/feed`,
    {
      parameters,
      httpMethod: 'POST',
      accessToken: pageAccessToken,
    },
    (error, result) => callback(error, result),
  );

  new GraphRequestManager().addRequest(infoRequest).start();
};

export const deletePost = (postId, pageAccessToken, callback) => {
  const infoRequest = new GraphRequest(
    `/${postId}`,
    {
      httpMethod: 'DELETE',
      accessToken: pageAccessToken,
    },
    (error, result) => callback(error, result),
  );

  new GraphRequestManager().addRequest(infoRequest).start();
};

export const publishNowPost = (postId, pageAccessToken, callback) => {
  const infoRequest = new GraphRequest(
    `/${postId}`,
    {
      parameters: { is_published: { string: 'true' } },
      httpMethod: 'POST',
      accessToken: pageAccessToken,
    },
    (error, result) => callback(error, result),
  );

  new GraphRequestManager().addRequest(infoRequest).start();
};

export const insights = (postId, metric, pageAccessToken, callback) => {
  graphRequest(
    `/${postId}/insights${metric}`,
    { fields: { string: 'values' } },
    pageAccessToken,
    callback,
  );
};

export const publishPhoto = (pageId, publishedOrUnpublished = POST_PUBLISHED, url, text, scheduledPublishTime, pageAccessToken, callback) => {
  const parameters = {
    url: { string: url },
  };

  if (text) {
    parameters.caption = { string: text };
  }

  if (publishedOrUnpublished !== POST_PUBLISHED) {
    parameters.published = { string: 'false' };
  }

  if (publishedOrUnpublished === POST_SCHEDULE) {
    parameters.scheduled_publish_time = { string: Math.round(scheduledPublishTime.getTime() / 1000).toString() };
  }

  const infoRequest = new GraphRequest(
    `/${pageId}/photos`,
    {
      parameters,
      httpMethod: 'POST',
      accessToken: pageAccessToken,
    },
    (error, result) => callback(error, result),
  );

  new GraphRequestManager().addRequest(infoRequest).start();
};
