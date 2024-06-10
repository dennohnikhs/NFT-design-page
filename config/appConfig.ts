import { Transak, TransakConfig } from "@transak/transak-sdk";


export const TRANSAK_STAGGING_API_KEY = "888f399b-f162-45a6-afa3-a96181f6c2c4"//umar


const transakConfig: TransakConfig = {
    apiKey: TRANSAK_STAGGING_API_KEY, // (Required)
    environment: Transak.ENVIRONMENTS.STAGING, // (Required) //Transak.ENVIRONMENTS.PRODUCTION
    widgetHeight:"90%",
    
    // .....
    // For the full list of customisation options check the link below
  };
  
export const transakClient = new Transak(transakConfig);



// To get all the events
Transak.on('*', (data) => {
    console.log("config here",data);
  });
  
  // This will trigger when the user closed the widget
  Transak.on(Transak.EVENTS.TRANSAK_WIDGET_CLOSE, () => {
    console.log('Transak SDK closed!');
  });
  
  /*
  * This will trigger when the user has confirmed the order
  * This doesn't guarantee that payment has completed in all scenarios
  * If you want to close/navigate away, use the TRANSAK_ORDER_SUCCESSFUL event
  */
  Transak.on(Transak.EVENTS.TRANSAK_ORDER_CREATED, (orderData) => {
    console.log(orderData);
  });
  
  /*
  * This will trigger when the user marks payment is made
  * You can close/navigate away at this event
  */
  Transak.on(Transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData) => {
    console.log(orderData);
    transakClient.close();
  });
  