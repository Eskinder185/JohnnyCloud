import json
import boto3
import os
from typing import Dict, Any

# Initialize AWS clients
bedrock = boto3.client('bedrock-runtime')
model_id = os.environ.get('BEDROCK_MODEL_ID', 'anthropic.claude-3-haiku-20240307-v1:0')
system_prompt = os.environ.get('SYSTEM_PROMPT', 
    "You are JohnnyCloud, an AWS cost & security assistant. Help users with AWS FinOps and SecOps questions. "
    "Be concise, helpful, and focus on cost optimization, security monitoring, and infrastructure insights.")

def lambda_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Lex fulfillment Lambda that processes user input and generates responses using Bedrock
    """
    try:
        # Extract user input from Lex event
        user_input = event.get('inputTranscript', '')
        session_attributes = event.get('sessionAttributes', {})
        
        if not user_input:
            return {
                'sessionAttributes': session_attributes,
                'dialogAction': {
                    'type': 'Close',
                    'fulfillmentState': 'Failed',
                    'message': {
                        'contentType': 'PlainText',
                        'content': 'I didn\'t receive any input. Please try again.'
                    }
                }
            }
        
        # Prepare the prompt for Bedrock
        prompt = f"{system_prompt}\n\nUser: {user_input}\n\nAssistant:"
        
        # Call Bedrock
        response = bedrock.invoke_model(
            modelId=model_id,
            body=json.dumps({
                "anthropic_version": "bedrock-2023-05-31",
                "max_tokens": 1000,
                "messages": [
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            }),
            contentType='application/json'
        )
        
        # Parse Bedrock response
        response_body = json.loads(response['body'].read())
        bot_response = response_body['content'][0]['text'].strip()
        
        # Return Lex response
        return {
            'sessionAttributes': session_attributes,
            'dialogAction': {
                'type': 'Close',
                'fulfillmentState': 'Fulfilled',
                'message': {
                    'contentType': 'PlainText',
                    'content': bot_response
                }
            }
        }
        
    except Exception as e:
        print(f"Error in Lambda: {str(e)}")
        return {
            'sessionAttributes': event.get('sessionAttributes', {}),
            'dialogAction': {
                'type': 'Close',
                'fulfillmentState': 'Failed',
                'message': {
                    'contentType': 'PlainText',
                    'content': 'I\'m having trouble processing your request right now. Please try again.'
                }
            }
        }

# IAM Policy for this Lambda:
"""
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "bedrock:InvokeModel"
            ],
            "Resource": "arn:aws:bedrock:*:*:model/anthropic.claude-3-haiku-20240307-v1:0"
        },
        {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents"
            ],
            "Resource": "arn:aws:logs:*:*:*"
        }
    ]
}
"""

