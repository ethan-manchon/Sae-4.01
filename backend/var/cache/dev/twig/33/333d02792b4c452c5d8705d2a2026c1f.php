<?php

use Twig\Environment;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Extension\CoreExtension;
use Twig\Extension\SandboxExtension;
use Twig\Markup;
use Twig\Sandbox\SecurityError;
use Twig\Sandbox\SecurityNotAllowedTagError;
use Twig\Sandbox\SecurityNotAllowedFilterError;
use Twig\Sandbox\SecurityNotAllowedFunctionError;
use Twig\Source;
use Twig\Template;
use Twig\TemplateWrapper;

/* registration/confirmation_email.html.twig */
class __TwigTemplate_8b5e9d301efca09428389e26bcf156af extends Template
{
    private Source $source;
    /**
     * @var array<string, Template>
     */
    private array $macros = [];

    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->source = $this->getSourceContext();

        $this->parent = false;

        $this->blocks = [
        ];
    }

    protected function doDisplay(array $context, array $blocks = []): iterable
    {
        $macros = $this->macros;
        $__internal_5a27a8ba21ca79b61932376b2fa922d2 = $this->extensions["Symfony\\Bundle\\WebProfilerBundle\\Twig\\WebProfilerExtension"];
        $__internal_5a27a8ba21ca79b61932376b2fa922d2->enter($__internal_5a27a8ba21ca79b61932376b2fa922d2_prof = new \Twig\Profiler\Profile($this->getTemplateName(), "template", "registration/confirmation_email.html.twig"));

        $__internal_6f47bbe9983af81f1e7450e9a3e3768f = $this->extensions["Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension"];
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->enter($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof = new \Twig\Profiler\Profile($this->getTemplateName(), "template", "registration/confirmation_email.html.twig"));

        // line 1
        yield "<!DOCTYPE html>
<html>
<head>
    <meta charset=\"UTF-8\">
    <title>Confirm Your Email</title>
</head>
<body style=\"margin: 0; padding: 0; background-color: #f5f8fa; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;\">
    <table align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"max-width: 600px;\">
        <tr>
            <td align=\"center\" style=\"padding: 20px 0;\">
                <img src=\"https://abs.twimg.com/icons/apple-touch-icon-192x192.png\" alt=\"Twitter\" style=\"display: block; width: 48px; height: 48px;\">
            </td>
        </tr>
        <tr>
            <td align=\"center\" style=\"padding: 20px; background-color: #ffffff; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);\">
                <h1 style=\"color: #14171a; font-size: 24px; margin-bottom: 20px;\">Hi! Please confirm your email</h1>
                <p style=\"color: #657786; font-size: 16px; line-height: 1.5;\">
                    Please confirm your email address by clicking the button below:
                </p>
                <p style=\"margin: 30px 0;\">
                    <a href=\"";
        // line 21
        yield (isset($context["signedUrl"]) || array_key_exists("signedUrl", $context) ? $context["signedUrl"] : (function () { throw new RuntimeError('Variable "signedUrl" does not exist.', 21, $this->source); })());
        yield "\" style=\"background-color: #1da1f2; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 9999px; font-weight: bold; font-size: 16px;\">
                        Confirm my Email
                    </a>
                </p>
                <p style=\"color: #657786; font-size: 14px;\">
                    This link will expire in ";
        // line 26
        yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape($this->extensions['Symfony\Bridge\Twig\Extension\TranslationExtension']->trans((isset($context["expiresAtMessageKey"]) || array_key_exists("expiresAtMessageKey", $context) ? $context["expiresAtMessageKey"] : (function () { throw new RuntimeError('Variable "expiresAtMessageKey" does not exist.', 26, $this->source); })()), (isset($context["expiresAtMessageData"]) || array_key_exists("expiresAtMessageData", $context) ? $context["expiresAtMessageData"] : (function () { throw new RuntimeError('Variable "expiresAtMessageData" does not exist.', 26, $this->source); })()), "VerifyEmailBundle"), "html", null, true);
        yield ".
                </p>
            </td>
        </tr>
        <tr>
            <td align=\"center\" style=\"padding: 20px 0; color: #657786; font-size: 14px;\">
                Cheers!
            </td>
        </tr>
    </table>
</body>
</html>
";
        
        $__internal_5a27a8ba21ca79b61932376b2fa922d2->leave($__internal_5a27a8ba21ca79b61932376b2fa922d2_prof);

        
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->leave($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof);

        yield from [];
    }

    /**
     * @codeCoverageIgnore
     */
    public function getTemplateName(): string
    {
        return "registration/confirmation_email.html.twig";
    }

    /**
     * @codeCoverageIgnore
     */
    public function isTraitable(): bool
    {
        return false;
    }

    /**
     * @codeCoverageIgnore
     */
    public function getDebugInfo(): array
    {
        return array (  78 => 26,  70 => 21,  48 => 1,);
    }

    public function getSourceContext(): Source
    {
        return new Source("<!DOCTYPE html>
<html>
<head>
    <meta charset=\"UTF-8\">
    <title>Confirm Your Email</title>
</head>
<body style=\"margin: 0; padding: 0; background-color: #f5f8fa; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;\">
    <table align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"max-width: 600px;\">
        <tr>
            <td align=\"center\" style=\"padding: 20px 0;\">
                <img src=\"https://abs.twimg.com/icons/apple-touch-icon-192x192.png\" alt=\"Twitter\" style=\"display: block; width: 48px; height: 48px;\">
            </td>
        </tr>
        <tr>
            <td align=\"center\" style=\"padding: 20px; background-color: #ffffff; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);\">
                <h1 style=\"color: #14171a; font-size: 24px; margin-bottom: 20px;\">Hi! Please confirm your email</h1>
                <p style=\"color: #657786; font-size: 16px; line-height: 1.5;\">
                    Please confirm your email address by clicking the button below:
                </p>
                <p style=\"margin: 30px 0;\">
                    <a href=\"{{ signedUrl|raw }}\" style=\"background-color: #1da1f2; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 9999px; font-weight: bold; font-size: 16px;\">
                        Confirm my Email
                    </a>
                </p>
                <p style=\"color: #657786; font-size: 14px;\">
                    This link will expire in {{ expiresAtMessageKey|trans(expiresAtMessageData, 'VerifyEmailBundle') }}.
                </p>
            </td>
        </tr>
        <tr>
            <td align=\"center\" style=\"padding: 20px 0; color: #657786; font-size: 14px;\">
                Cheers!
            </td>
        </tr>
    </table>
</body>
</html>
", "registration/confirmation_email.html.twig", "/app/backend/templates/registration/confirmation_email.html.twig");
    }
}
